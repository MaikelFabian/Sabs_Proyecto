// src/detalles/detalles.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource } from "typeorm";
import { Detalles } from "./entities/detalle.entity";
import { CreateDetallesDto } from "./dto/create-detalle.dto";
import { UpdateDetallesDto } from "./dto/update-detalle.dto";
import { Solicitud } from "src/solicitudes/entities/solicitud.entity";
import { Movimiento } from "src/movimientos/entities/movimiento.entity";
import { Material } from "src/materiales/entities/materiale.entity";
import { TipoMovimiento } from "src/tipo-movimiento/entities/tipo-movimiento.entity";
import { Sitio } from "src/sitios/entities/sitio.entity";

@Injectable()
export class DetallesService {
  constructor(
    @InjectRepository(Detalles)
    private readonly repo: Repository<Detalles>,
    @InjectRepository(Solicitud)
    private readonly solicitudRepository: Repository<Solicitud>,
    @InjectRepository(Movimiento)
    private readonly movimientoRepository: Repository<Movimiento>,
    @InjectRepository(Material)
    private readonly materialRepository: Repository<Material>,
    @InjectRepository(TipoMovimiento)
    private readonly tipoMovimientoRepository: Repository<TipoMovimiento>,
    private readonly dataSource: DataSource
  ) {}

  async aprobar(id: number, personaApruebaId?: number) {
    return await this.dataSource.transaction(async (manager) => {
      console.log("🔄 Iniciando proceso de aprobación para detalle:", id);

      const detalle = await manager.findOne(Detalles, {
        where: { id },
        relations: {
          solicitud: true,
          material: true,
        },
      });

      if (!detalle) {
        throw new NotFoundException(`Detalle con ID ${id} no encontrado`);
      }

      if (detalle.estado !== "PENDIENTE") {
        throw new BadRequestException(
          `El detalle debe estar en estado PENDIENTE. Estado actual: ${detalle.estado}`
        );
      }

      console.log("✅ Detalle encontrado:", detalle.id);
      console.log("📦 Material:", detalle.material?.nombre);
      console.log("📊 Cantidad a procesar:", detalle.cantidad);

      const movimiento = await manager.findOne(Movimiento, {
        where: { detalleId: detalle.id },
        relations: {
          tipoMovimiento: true,
          material: true,
          sitio: true,
        },
      });

      if (!movimiento) {
        throw new BadRequestException(
          "No se encontró movimiento asociado al detalle"
        );
      }

      console.log(
        "✅ Movimiento encontrado:",
        movimiento.id,
        "Tipo:",
        movimiento.tipoMovimiento?.nombre
      );

      // ✅ NUEVA LÓGICA: Determinar el tipo de operación
      const tipoMovimiento = movimiento.tipoMovimiento?.nombre?.toLowerCase();
      const esDevolucion = tipoMovimiento === 'devolucion' || tipoMovimiento === 'devolución';
      
      if (esDevolucion) {
        // 🔄 LÓGICA DE DEVOLUCIÓN: Reintegrar y eliminar
        console.log("🔄 Procesando devolución - reintegrando material");
        
        // Buscar el material original en el sitio de origen
        let materialOrigen = await manager.findOne(Material, {
          where: {
            nombre: detalle.material.nombre,
            tipoMaterialId: detalle.material.tipoMaterialId,
            unidadMedidaId: detalle.material.unidadMedidaId,
            sitioId: movimiento.sitio?.id,
            esOriginal: true
          },
        });
      
        if (materialOrigen) {
          // Reintegrar cantidad al stock original
          materialOrigen.stock += detalle.cantidad;
          await manager.save(Material, materialOrigen);
          console.log(`✅ Stock reintegrado: +${detalle.cantidad} al material original`);
        } else {
          // Crear nuevo material en sitio origen con la cantidad devuelta
          materialOrigen = await manager.save(Material, {
            codigo: detalle.material.codigo,
            nombre: detalle.material.nombre,
            descripcion: detalle.material.descripcion,
            tipoMaterialId: detalle.material.tipoMaterialId,
            unidadMedidaId: detalle.material.unidadMedidaId,
            categoriaMaterialId: detalle.material.categoriaMaterialId,
            stock: detalle.cantidad,
            sitioId: movimiento.sitio?.id,
            registradoPorId: personaApruebaId,
            esOriginal: true,
            requiereDevolucion: detalle.material.requiereDevolucion,
            caduca: detalle.material.caduca,
            fechaVencimiento: detalle.material.fechaVencimiento,
            activo: true
          });
          console.log(`✅ Nuevo material creado en sitio origen con stock ${detalle.cantidad}`);
        }
      
        // Eliminar el material del sitio de devolución
        if (detalle.material.stock <= detalle.cantidad) {
          // Si el stock es igual o menor, eliminar completamente
          await manager.remove(Material, detalle.material);
          console.log(`✅ Material eliminado del sitio de devolución`);
        } else {
          // Si hay más stock, solo reducir
          detalle.material.stock -= detalle.cantidad;
          await manager.save(Material, detalle.material);
          console.log(`✅ Stock reducido en sitio de devolución: -${detalle.cantidad}`);
        }
      
        detalle.estado = "DEVUELTO";
        
      } else {
        // 🚚 LÓGICA DE PETICIÓN: Préstamo o Consumo
        if (detalle.material.requiereDevolucion) {
          console.log("🔄 Material prestable - creando duplicado y cambiando a PRESTADO");
          detalle.estado = "PRESTADO";
          
          // Ejecutar movimiento de inventario (descontar stock y crear material duplicado)
          await this.ejecutarMovimientoInventario(
            manager,
            movimiento,
            detalle.material
          );
        } else {
          console.log("🗑️ Material consumible - solo reduciendo stock y cambiando a CONSUMIDO");
          detalle.estado = "CONSUMIDO";
          
          // Solo reducir stock del original, no crear duplicado
          if (detalle.material.stock < detalle.cantidad) {
            throw new BadRequestException(
              `Stock insuficiente. Disponible: ${detalle.material.stock}, Requerido: ${detalle.cantidad}`
            );
          }
          
          detalle.material.stock -= detalle.cantidad;
          await manager.save(Material, detalle.material);
          console.log(`✅ Stock reducido: -${detalle.cantidad}, Stock actual: ${detalle.material.stock}`);
        }
      }

      // Actualizar información de aprobación
      if (personaApruebaId) {
        detalle.personaApruebaId = personaApruebaId;
      }
      detalle.fechaActualizacion = new Date();
      await manager.save(Detalles, detalle);
      console.log(`✅ Detalle actualizado a ${detalle.estado}`);

      // ✅ Verificar si todos los detalles de la solicitud están procesados
      if (detalle.solicitudId) {
        const detallesPendientes = await manager.count(Detalles, {
          where: {
            solicitudId: detalle.solicitudId,
            estado: "PENDIENTE",
          },
        });

        if (detallesPendientes === 0) {
          const solicitud = await manager.findOne(Solicitud, {
            where: { id: detalle.solicitudId },
          });
          
          if (solicitud) {
            const hayPrestados = await manager.count(Detalles, {
              where: {
                solicitudId: detalle.solicitudId,
                estado: "PRESTADO",
              },
            }) > 0;
            
            const hayConsumidos = await manager.count(Detalles, {
              where: {
                solicitudId: detalle.solicitudId,
                estado: "CONSUMIDO",
              },
            }) > 0;
            
            const hayDevueltos = await manager.count(Detalles, {
              where: {
                solicitudId: detalle.solicitudId,
                estado: "DEVUELTO",
              },
            }) > 0;
            
            if (hayPrestados) {
              solicitud.estado = "ENTREGADA";
            } else if (hayDevueltos) {
              solicitud.estado = "DEVUELTA";
            } else {
              solicitud.estado = "ENTREGADA";
            }
            
            solicitud.fechaActualizacion = new Date();
            await manager.save(Solicitud, solicitud);
            console.log(`✅ Solicitud marcada como ${solicitud.estado}`);
          }
        }
      }

      console.log("🎉 Aprobación completada exitosamente");
      return {
        message: `Detalle ${detalle.estado.toLowerCase()} exitosamente`,
        data: {
          detalle,
          movimiento,
        },
      };
    });
  }

  private async ejecutarMovimientoInventario(
    manager: any,
    movimiento: Movimiento,
    material: Material
  ) {
    console.log("📦 Ejecutando movimiento de inventario...");
    console.log(`   - Tipo: ${movimiento.tipoMovimiento?.nombre}`);
    console.log(`   - Cantidad: ${movimiento.cantidad}`);
    console.log(`   - Stock actual: ${material.stock}`);

    const tipoMovimiento = movimiento.tipoMovimiento;
    if (!tipoMovimiento) {
      throw new BadRequestException("Tipo de movimiento no encontrado");
    }

    const tipo = tipoMovimiento.nombre?.toLowerCase();
    if (!tipo) {
      throw new BadRequestException("Tipo de movimiento no encontrado");
    }

    let targetMaterial = material;
    if (movimiento.sitioId) {
      const destinoSitio = await manager.findOne(Sitio, {
        where: { id: movimiento.sitioId },
      });
      if (!destinoSitio)
        throw new BadRequestException("Sitio destino no encontrado");

      let materialDestino = await manager.findOne(Material, {
        where: {
          nombre: material.nombre,
          tipoMaterialId: material.tipoMaterialId,
          unidadMedidaId: material.unidadMedidaId,
          categoriaMaterialId: material.categoriaMaterialId,
          sitioId: movimiento.sitioId,
        },
      });

      if (materialDestino) {
        targetMaterial = materialDestino;
      } else {
        // 🚨 AQUÍ SE CREAN MATERIALES DUPLICADOS - MEJORADO
        targetMaterial = manager.create(Material, {
          codigo: `${material.codigo}_${destinoSitio.nombre.slice(0, 3).toUpperCase()}`,
          nombre: material.nombre,
          descripcion: material.descripcion,
          stock: 0,
          caduca: material.caduca,
          fechaVencimiento: material.fechaVencimiento,
          activo: true,
          tipoMaterialId: material.tipoMaterialId,
          unidadMedidaId: material.unidadMedidaId,
          categoriaMaterialId: material.categoriaMaterialId,
          sitioId: movimiento.sitioId,
          registradoPorId: movimiento.personaId,
          esOriginal: false, // ← Marcar como NO original
          materialOrigenId: material.id, // ← Referenciar al material original
        });
        await manager.save(Material, targetMaterial);
      }
      console.log("✅ Material destino preparado");
    }

    if (tipo === "entrada") {
      targetMaterial.stock += movimiento.cantidad;
      console.log(` Entrada: +${movimiento.cantidad}`);
    } else if (tipo === "salida") {
      if (material.stock < movimiento.cantidad) {
        throw new BadRequestException(
          `Stock insuficiente. Disponible: ${material.stock}, Requerido: ${movimiento.cantidad}`
        );
      }
      material.stock -= movimiento.cantidad;
      console.log(` Salida: -${movimiento.cantidad}`);
      await manager.save(Material, material);
      console.log(` Stock origen actualizado: ${material.stock}`);
      if (movimiento.sitioId) {
        targetMaterial.stock += movimiento.cantidad;
      }
    }

    await manager.save(Material, targetMaterial);
    console.log(` Stock destino actualizado: ${targetMaterial.stock}`);

    if (movimiento.sitioId) {
      console.log("✅ Transferencia a sitio completada");
    }
  }

  async rechazar(id: number, personaApruebaId?: number) {
    return await this.dataSource.transaction(async (manager) => {
      const detalle = await manager.findOne(Detalles, {
        where: { id },
        relations: ["solicitud"],
      });

      if (!detalle) {
        throw new NotFoundException(`Detalle no encontrado id: ${id}`);
      }

      if (detalle.estado !== "PENDIENTE") {
        throw new BadRequestException(
          "Solo se pueden rechazar detalles pendientes"
        );
      }

      // ✅ SOLO actualizar el estado del detalle
      detalle.estado = "RECHAZADO";
      if (personaApruebaId) {
        detalle.personaApruebaId = personaApruebaId;
      }
      detalle.fechaActualizacion = new Date();
      await manager.save(Detalles, detalle);

      // ❌ ELIMINAR ESTA SECCIÓN - NO actualizar la solicitud automáticamente
      // const solicitud = detalle.solicitud;
      // solicitud.estado = 'RECHAZADA';
      // solicitud.fechaActualizacion = new Date();
      // await manager.save(Solicitud, solicitud);

      return { message: "Detalle rechazado", data: detalle };
    });
  }

  async findPendientes() {
    const detallesPendientes = await this.repo.find({
      where: { estado: "PENDIENTE" },
      relations: {
        material: true,
        solicitud: {
          solicitante: true,
        },
      },
      order: {
        fechaCreacion: "DESC",
      },
    });

    return {
      message: "Detalles pendientes de aprobación",
      data: detallesPendientes,
    };
  }

  async findBySolicitud(solicitudId: number) {
    const detalles = await this.repo.find({
      where: { solicitudId },
      relations: {
        material: true,
        solicitud: true,
      },
      order: {
        fechaCreacion: "DESC",
      },
    });

    return {
      message: `Detalles de la solicitud ${solicitudId}`,
      data: detalles,
    };
  }

  async findByEstado(estado: string) {
    const detalles = await this.repo.find({
      where: {
        estado: estado as
          | "PENDIENTE"
          | "APROBADO"
          | "RECHAZADO"
          | "PRESTADO"
          | "DEVUELTO"
          | "CONSUMIDO", // ✅ Agregar nuevo estado
      },
      relations: {
        material: true,
        solicitud: {
          solicitante: true,
        },
      },
      order: {
        fechaCreacion: "DESC",
      },
    });

    return {
      message: `Detalles con estado: ${estado}`,
      data: detalles,
    };
  }

  async create(dto: CreateDetallesDto) {
    const nuevo = this.repo.create(dto);
    const guardado = await this.repo.save(nuevo);
    return { message: "Detalle creado", data: guardado };
  }

  async findAll() {
    const lista = await this.repo.find({
      relations: {
        material: true,
        solicitud: {
          solicitante: true,
        },
      },
      order: {
        fechaCreacion: "DESC",
      },
    });
    return { message: "Listado de detalles", data: lista };
  }

  async findOne(id: number) {
    const encontrado = await this.repo.findOne({
      where: { id },
      relations: {
        material: true,
        solicitud: {
          solicitante: true,
        },
      },
    });
    if (!encontrado) {
      throw new NotFoundException(`Detalle no encontrado id: ${id}`);
    }
    return { message: "Detalle encontrado", data: encontrado };
  }

  async update(id: number, dto: UpdateDetallesDto) {
    await this.repo.update(id, dto);
    const actualizado = await this.repo.findOne({
      where: { id },
      relations: ["material", "solicitud"],
    });
    return { message: "Detalle actualizado", data: actualizado };
  }

  async remove(id: number) {
    const detalle = await this.repo.findOne({ where: { id } });
    if (!detalle) {
      throw new NotFoundException(`Detalle no encontrado id: ${id}`);
    }

    if (detalle.estado === "APROBADO") {
      throw new BadRequestException("No se puede eliminar un detalle aprobado");
    }

    await this.repo.delete(id);
    return { message: "Detalle eliminado" };
  }

  async findHistorialCompleto() {
    const query = `
      SELECT 
        d.id as "detalleId",
        d.cantidad,
        d.estado,
        d."fechaCreacion" as "fechaSolicitud",
        d."fechaActualizacion" as "fechaActualizacion",
        
        -- Material
        m.nombre as "materialNombre",
        m.descripcion as "materialDescripcion",
        
        -- Solicitud
        s.descripcion as "solicitudDescripcion",
        s.estado as "solicitudEstado",
        
        -- Persona Solicitante (a través de la solicitud)
        ps.id as "personaSolicitanteId",
        ps.identificacion as "personaIdentificacion",
        ps.nombre as "personaNombre",
        ps.apellido as "personaApellido",
        ps.correo as "personaCorreo",
        ps.telefono as "personaTelefono",
        
        -- Ficha
        f.id as "fichaId",
        f.numero as "fichaNumero",
        f."cantidadAprendices",
        
        -- Titulado (área de la ficha)
        t.id as "tituladoId",
        t.nombre as "tituladoNombre",
        
        -- Área
        a.id as "areaId",
        a.nombre as "areaNombre",
        
        -- Centro (a través de área-centro)
        c.id as "centroId",
        c.nombre as "centroNombre",
        
        -- Sede
        se.id as "sedeId",
        se.nombre as "sedeNombre",
        se.direccion as "sedeDireccion",
        
        -- Municipio
        mu.id as "municipioId",
        mu.nombre as "municipioNombre",
        
        -- Persona que aprobó
        pa.id as "personaApruebaId",
        pa.nombre as "personaApruebaNombre",
        pa.apellido as "personaApruebaApellido",
        
        -- Sitio de destino desde movimiento
        sit.id as "sitioDestinoId",
        sit.nombre as "sitioDestinoNombre",
        tsit.nombre as "tipoSitioNombre"
        
      FROM detalles d
      LEFT JOIN material m ON d."materialId" = m.id
      LEFT JOIN solicitud s ON d."solicitudId" = s.id
      LEFT JOIN persona ps ON s."solicitanteId" = ps.id
      LEFT JOIN ficha f ON ps."fichaId" = f.id
      LEFT JOIN titulado t ON f.id = t."fichaId"
      LEFT JOIN area a ON t."areaId" = a.id
      LEFT JOIN area_centro ac ON a.id = ac."areaId"
      LEFT JOIN centro c ON ac."centroId" = c.id
      LEFT JOIN sede se ON c.id = se."centroId"
      LEFT JOIN municipio mu ON c."municipioId" = mu.id
      LEFT JOIN persona pa ON d."personaApruebaId" = pa.id
      LEFT JOIN movimiento mov ON d.id = mov."detalleId"
      LEFT JOIN sitio sit ON mov."sitioId" = sit.id
      LEFT JOIN tipo_sitio tsit ON sit."tipoSitioId" = tsit.id
      
      WHERE d.id IS NOT NULL
      ORDER BY d."fechaCreacion" DESC, d.id DESC
    `;

    const historial = await this.repo.query(query);

    return {
      message: "Historial completo de detalles",
      data: historial,
    };
  }

  async findHistorialPorPersona(personaId: number) {
    const query = `
      SELECT 
        d.id as "detalleId",
        d.cantidad,
        d.estado,
        d."fechaCreacion" as "fechaSolicitud",
        d."fechaActualizacion" as "fechaActualizacion",
        
        -- Material
        m.nombre as "materialNombre",
        m.descripcion as "materialDescripcion",
        
        -- Solicitud
        s.descripcion as "solicitudDescripcion",
        s.estado as "solicitudEstado",
        
        -- Persona Solicitante
        ps.id as "personaSolicitanteId",
        ps.identificacion as "personaIdentificacion",
        ps.nombre as "personaNombre",
        ps.apellido as "personaApellido",
        ps.correo as "personaCorreo",
        ps.telefono as "personaTelefono",
        
        -- Información organizacional
        f.numero as "fichaNumero",
        t.nombre as "tituladoNombre",
        a.nombre as "areaNombre",
        c.nombre as "centroNombre",
        se.nombre as "sedeNombre",
        se.direccion as "sedeDireccion",
        mu.nombre as "municipioNombre",
        
        -- Sitio de destino desde movimiento
        sit.id as "sitioDestinoId",
        sit.nombre as "sitioDestinoNombre",
        tsit.nombre as "tipoSitioNombre"
        
      FROM detalles d
      LEFT JOIN material m ON d."materialId" = m.id
      LEFT JOIN solicitud s ON d."solicitudId" = s.id
      LEFT JOIN persona ps ON s."solicitanteId" = ps.id
      LEFT JOIN ficha f ON ps."fichaId" = f.id
      LEFT JOIN titulado t ON f.id = t."fichaId"
      LEFT JOIN area a ON t."areaId" = a.id
      LEFT JOIN area_centro ac ON a.id = ac."areaId"
      LEFT JOIN centro c ON ac."centroId" = c.id
      LEFT JOIN sede se ON c.id = se."centroId"
      LEFT JOIN municipio mu ON c."municipioId" = mu.id
      LEFT JOIN movimiento mov ON d.id = mov."detalleId"
      LEFT JOIN sitio sit ON mov."sitioId" = sit.id
      LEFT JOIN tipo_sitio tsit ON sit."tipoSitioId" = tsit.id
      
      WHERE ps.id = $1
      ORDER BY d."fechaCreacion" DESC, d.id DESC
    `;

    const historial = await this.repo.query(query, [personaId]);

    return {
      message: `Historial de detalles para persona ID: ${personaId}`,
      data: historial,
    };
  }

  async entregar(id: number, personaId?: number) {
    return await this.dataSource.transaction(async (manager) => {
      console.log("🔍 DEBUGGING - Iniciando entregar para ID:", id);
      console.log("🔍 DEBUGGING - PersonaId recibido:", personaId);

      const detalle = await manager.findOne(Detalles, {
        where: { id },
        relations: {
          solicitud: true,
          material: true,
        },
      });

      if (!detalle) {
        throw new NotFoundException(`Detalle con ID ${id} no encontrado`);
      }

      // ✅ CORRECCIÓN: Validar que esté APROBADO, no PENDIENTE
      console.log("🔍 DEBUGGING - Validando estado APROBADO...");
      if (detalle.estado !== "APROBADO") {
        console.log(
          "❌ DEBUGGING - Estado inválido:",
          detalle.estado,
          "- Se esperaba: APROBADO"
        );
        throw new BadRequestException(
          `El detalle debe estar APROBADO para ser entregado. Estado actual: ${detalle.estado}`
        );
      }
      console.log("✅ DEBUGGING - Estado válido: APROBADO");

      console.log("🚚 Iniciando entrega para detalle:", id);
      console.log("📦 Material:", detalle.material?.nombre);
      console.log("📊 Cantidad a entregar:", detalle.cantidad);

      // Buscar el movimiento asociado
      const movimiento = await manager.findOne(Movimiento, {
        where: { detalleId: detalle.id },
        relations: {
          tipoMovimiento: true,
          material: true,
          sitio: true,
        },
      });

      if (!movimiento) {
        throw new BadRequestException(
          "No se encontró movimiento asociado al detalle"
        );
      }

      console.log(
        "✅ Movimiento encontrado:",
        movimiento.id,
        "Tipo:",
        movimiento.tipoMovimiento?.nombre
      );

      // ✅ NUEVA LÓGICA: Diferenciada según requiereDevolucion
      if (detalle.material.requiereDevolucion) {
        console.log(
          "🔄 Material retornable - creando duplicado y cambiando a PRESTADO"
        );

        // Material retornable - cambiar estado a 'PRESTADO' y crear duplicado
        detalle.estado = "PRESTADO";

        // Ejecutar movimiento de inventario (descontar stock y crear material duplicado)
        await this.ejecutarMovimientoInventario(
          manager,
          movimiento,
          detalle.material
        );
      } else {
        console.log(
          "🗑️ Material consumible - solo reduciendo stock y cambiando a CONSUMIDO"
        );

        // Material consumible - cambiar estado a 'CONSUMIDO'
        detalle.estado = "CONSUMIDO";

        // Solo reducir stock del original, no crear duplicado
        if (detalle.material.stock < detalle.cantidad) {
          throw new BadRequestException(
            `Stock insuficiente. Disponible: ${detalle.material.stock}, Requerido: ${detalle.cantidad}`
          );
        }

        detalle.material.stock -= detalle.cantidad;
        await manager.save(Material, detalle.material);
        console.log(
          `✅ Stock reducido: -${detalle.cantidad}, Stock actual: ${detalle.material.stock}`
        );
      }

      // Actualizar información de entrega
      if (personaId) {
        detalle.personaEntregaId = personaId;
      }
      detalle.fechaActualizacion = new Date();
      await manager.save(Detalles, detalle);

      console.log(`✅ Detalle actualizado a ${detalle.estado}`);

      // Verificar si todos los detalles de la solicitud están entregados/consumidos
      if (detalle.solicitudId) {
        const detallesPendientesEntrega = await manager.count(Detalles, {
          where: {
            solicitudId: detalle.solicitudId,
            estado: "APROBADO", // Contar los que aún no han sido entregados
          },
        });

        if (detallesPendientesEntrega === 0) {
          const solicitud = await manager.findOne(Solicitud, {
            where: { id: detalle.solicitudId },
          });
          if (solicitud) {
            solicitud.estado = "ENTREGADA";
            solicitud.fechaActualizacion = new Date();
            await manager.save(Solicitud, solicitud);
            console.log("✅ Solicitud marcada como ENTREGADA");
          }
        }
      }

      return {
        message: `Detalle ${detalle.material.requiereDevolucion ? "prestado" : "consumido"} exitosamente`,
        data: detalle,
      };
    });
  }

  async devolver(id: number, personaId?: number) {
    return await this.dataSource.transaction(async (manager) => {
      const detalle = await manager.findOne(Detalles, {
        where: { id },
        relations: {
          solicitud: true,
          material: true,
          movimiento: {
            sitio: true, // ✅ Asegurar que se carga la relación
          },
        },
      });

      if (!detalle) {
        throw new NotFoundException(`Detalle con ID ${id} no encontrado`);
      }

      if (detalle.estado !== "PRESTADO") {
        throw new BadRequestException(
          `El detalle debe estar PRESTADO para ser devuelto. Estado actual: ${detalle.estado}`
        );
      }

      // ✅ VALIDACIÓN ADICIONAL: Verificar que existe el movimiento y sitio
      if (!detalle.movimiento) {
        throw new BadRequestException(
          "No se encontró el movimiento asociado al detalle"
        );
      }

      if (!detalle.movimiento.sitio) {
        throw new BadRequestException(
          "No se encontró el sitio de origen en el movimiento"
        );
      }

      // Actualizar estado del detalle
      detalle.estado = "DEVUELTO";
      if (personaId) {
        detalle.personaDevuelveId = personaId;
      } else if (detalle.personaEntregaId) {
        detalle.personaDevuelveId = detalle.personaEntregaId;
      }
      detalle.fechaActualizacion = new Date();
      await manager.save(Detalles, detalle);

      // **LÓGICA DE REINTEGRACIÓN: Reintegrar material al sitio de origen**
      const sitioOrigen = detalle.movimiento.sitio;
      const material = detalle.material;

      // Buscar o crear material en el sitio de origen
      let materialOrigen = await manager.findOne(Material, {
        where: {
          nombre: material.nombre,
          tipoMaterialId: material.tipoMaterialId,
          unidadMedidaId: material.unidadMedidaId,
          sitioId: sitioOrigen.id,
        },
      });

      if (materialOrigen) {
        // Reintegrar cantidad al stock original
        materialOrigen.stock += detalle.cantidad;
        await manager.save(Material, materialOrigen);
        console.log(
          `✅ Stock reintegrado: +${detalle.cantidad} al material ${materialOrigen.nombre} en sitio ${sitioOrigen.nombre}`
        );
      } else {
        // Crear nuevo material en sitio origen con la cantidad devuelta
        const nuevoMaterial = await manager.save(Material, {
          nombre: material.nombre,
          descripcion: material.descripcion,
          tipoMaterialId: material.tipoMaterialId,
          unidadMedidaId: material.unidadMedidaId,
          stock: detalle.cantidad,
          sitioId: sitioOrigen.id,
          fechaCreacion: new Date().toISOString(),
          fechaActualizacion: new Date().toISOString(),
        });
        console.log(`✅ Nuevo material creado en sitio origen: ${nuevoMaterial.nombre} con stock ${detalle.cantidad}`);
      }

      // ✅ IMPORTANTE: Eliminar o reducir stock del material prestado
      const materialPrestado = detalle.material;
      if (materialPrestado.stock >= detalle.cantidad) {
        materialPrestado.stock -= detalle.cantidad;
        if (materialPrestado.stock === 0) {
          // Si el stock llega a 0, marcar como inactivo o eliminar
          materialPrestado.activo = false;
        }
        await manager.save(Material, materialPrestado);
        console.log(
          `✅ Stock del material prestado reducido: -${detalle.cantidad}`
        );
      }

      // Verificar si todos los detalles de la solicitud están devueltos
      if (detalle.solicitudId) {
        const detallesPrestados = await manager.count(Detalles, {
          where: {
            solicitudId: detalle.solicitudId,
            estado: "PRESTADO",
          },
        });

        if (detallesPrestados === 0) {
          const solicitud = await manager.findOne(Solicitud, {
            where: { id: detalle.solicitudId },
          });
          if (solicitud && solicitud.estado === "ENTREGADA") {
            solicitud.estado = "DEVUELTA";
            solicitud.fechaActualizacion = new Date();
            await manager.save(Solicitud, solicitud);
            console.log("✅ Solicitud marcada como DEVUELTA");
          }
        }
      }

      return {
        message:
          "Detalle devuelto exitosamente y material reintegrado al sitio de origen",
        data: detalle,
      };
    });
  }
}
