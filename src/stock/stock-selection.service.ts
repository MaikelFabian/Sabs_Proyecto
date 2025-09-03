import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stock } from './entities/stock.entity';
import { StockMovimiento } from './entities/stock-movimiento.entity';
import { Material } from 'src/materiales/entities/materiale.entity';

@Injectable()
export class StockSelectionService {
  constructor(
    @InjectRepository(Stock)
    private stockRepository: Repository<Stock>,
    @InjectRepository(StockMovimiento)
    private stockMovimientoRepository: Repository<StockMovimiento>,
    @InjectRepository(Material)
    private materialRepository: Repository<Material>,
  ) {}

  /**
   * Selecciona stocks específicos para un movimiento
   * Prioriza stocks con códigos si el material los requiere
   */
  async seleccionarStocksParaMovimiento(
    materialId: number,
    cantidadRequerida: number,
    sitioOrigenId: number
  ): Promise<Stock[]> {
    // Buscar stocks activos del material en el sitio origen
    const stocksDisponibles = await this.stockRepository.find({
      where: {
        materialId,
        activo: true,
        material: { sitioId: sitioOrigenId }
      },
      relations: ['material'],
      order: {
        requiereCodigo: 'DESC', // Priorizar stocks con código
        fechaCreacion: 'ASC'    // FIFO para stocks sin código
      }
    });

    if (!stocksDisponibles.length) {
      throw new BadRequestException('No hay stocks disponibles para el material');
    }

    const stocksSeleccionados: Stock[] = [];
    let cantidadRestante = cantidadRequerida;

    for (const stock of stocksDisponibles) {
      if (cantidadRestante <= 0) break;

      const cantidadTomar = Math.min(stock.cantidad, cantidadRestante);
      
      if (cantidadTomar > 0) {
        stocksSeleccionados.push({
          ...stock,
          cantidad: cantidadTomar // Cantidad específica a mover
        });
        cantidadRestante -= cantidadTomar;
      }
    }

    if (cantidadRestante > 0) {
      throw new BadRequestException(
        `Stock insuficiente. Disponible: ${cantidadRequerida - cantidadRestante}, Requerido: ${cantidadRequerida}`
      );
    }

    return stocksSeleccionados;
  }

  /**
   * Transfiere stocks específicos a un sitio destino
   */
  async transferirStocks(
    stocksSeleccionados: Stock[],
    movimientoId: number,
    sitioDestinoId: number,
    manager: any
  ): Promise<void> {
    for (const stockSeleccionado of stocksSeleccionados) {
      // Reducir cantidad del stock origen
      const stockOrigen = await manager.findOne(Stock, {
        where: { id: stockSeleccionado.id },
        relations: ['material'] // ✅ AGREGADA: Cargar relación material
      });

      if (!stockOrigen) {
        throw new BadRequestException(`Stock ${stockSeleccionado.id} no encontrado`);
      }

      stockOrigen.cantidad -= stockSeleccionado.cantidad;
      await manager.save(Stock, stockOrigen);

      // Crear stock en sitio destino
      const nuevoStock = manager.create(Stock, {
        codigo: stockOrigen.codigo,
        cantidad: stockSeleccionado.cantidad,
        activo: true,
        requiereCodigo: stockOrigen.requiereCodigo,
        materialId: stockOrigen.materialId,
        stockOrigenId: stockOrigen.id,
        esTransferido: true
      });

      // Primero necesitamos encontrar el material en el sitio destino
      const materialDestino = await manager.findOne(Material, {
        where: {
          nombre: stockOrigen.material.nombre, // ✅ AHORA FUNCIONA: material está cargado
          tipoMaterialId: stockOrigen.material.tipoMaterialId,
          unidadMedidaId: stockOrigen.material.unidadMedidaId,
          sitioId: sitioDestinoId
        }
      });

      if (materialDestino) {
        nuevoStock.materialId = materialDestino.id;
      }

      const stockDestino = await manager.save(Stock, nuevoStock);

      // Registrar el movimiento de stock
      const stockMovimientoSalida = manager.create(StockMovimiento, {
        movimientoId,
        stockId: stockOrigen.id,
        cantidad: stockSeleccionado.cantidad,
        tipoOperacion: 'salida',
        stockDestinoId: stockDestino.id
      });

      const stockMovimientoEntrada = manager.create(StockMovimiento, {
        movimientoId,
        stockId: stockDestino.id,
        cantidad: stockSeleccionado.cantidad,
        tipoOperacion: 'entrada'
      });

      await manager.save(StockMovimiento, stockMovimientoSalida);
      await manager.save(StockMovimiento, stockMovimientoEntrada);
    }
  }

  /**
   * Devuelve stocks específicos al sitio origen
   */
  async devolverStocks(
    stocksADevolver: Stock[],
    movimientoId: number,
    manager: any
  ): Promise<void> {
    for (const stock of stocksADevolver) {
      if (!stock.esTransferido || !stock.stockOrigenId) {
        throw new BadRequestException(
          `El stock ${stock.id} no es un stock transferido válido para devolución`
        );
      }

      // Encontrar el stock original
      const stockOrigen = await manager.findOne(Stock, {
        where: { id: stock.stockOrigenId }
      });

      if (stockOrigen) {
        // Devolver cantidad al stock original
        stockOrigen.cantidad += stock.cantidad;
        await manager.save(Stock, stockOrigen);
      }

      // Reducir o eliminar el stock transferido
      stock.cantidad -= stock.cantidad;
      if (stock.cantidad <= 0) {
        stock.activo = false;
      }
      await manager.save(Stock, stock);

      // Registrar el movimiento de devolución
      const stockMovimientoDevolucion = manager.create(StockMovimiento, {
        movimientoId,
        stockId: stock.id,
        cantidad: stock.cantidad,
        tipoOperacion: 'salida' // Sale del sitio prestado
      });

      await manager.save(StockMovimiento, stockMovimientoDevolucion);
    }
  }
}