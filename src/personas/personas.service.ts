// src/personas/personas.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Persona } from './entities/persona.entity';
import * as bcrypt from 'bcryptjs';
import { UpdatePersonaDto } from './dto/update-persona.dto';

@Injectable()
export class PersonasService {
  constructor(
    @InjectRepository(Persona)
    private readonly personaRepository: Repository<Persona>,
  ) {}

  async create(data: Partial<Persona>) {
    if (data.contrasena) {
      const salt = bcrypt.genSaltSync(10);
      data.contrasena = bcrypt.hashSync(data.contrasena, salt);
    }

    if (data.rolId) {
      data.rol = { id: data.rolId } as any;
    }

    // Manejo de fichaId: verificar si es inválido (cadena vacía, null/undefined, o no numérico)
    const fichaIdValue = data.fichaId;
    if (
      fichaIdValue == null ||
      (typeof fichaIdValue === 'string' && (fichaIdValue === '' || isNaN(Number(fichaIdValue)))) ||
      (typeof fichaIdValue === 'number' && isNaN(fichaIdValue))
    ) {
      delete data.fichaId;
      delete data.ficha;
    } else {
      // Convertir a número si es cadena
      data.fichaId = typeof fichaIdValue === 'string' ? Number(fichaIdValue) : fichaIdValue;
      data.ficha = { id: data.fichaId } as any;
    }

    const nuevo = await this.personaRepository.save(data);
    return {
      message: 'Persona creada exitosamente',
      data: nuevo,
    };
  }

  async findAll() {
    const listar = await this.personaRepository.find({
      relations: [
        'aprobaciones',
        'movimientos',
        'ficha',
        'rol',
      ],
    });
    return {
      message: 'Listado de personas',
      data: listar,
    };
  }

  async findOne(id: number) {
    const buscar = await this.personaRepository.findOne({
      where: { id },
      relations: [
        'aprobaciones',
        'movimientos',
        'ficha',
        'rol',
      ],
    });
    return {
      message: 'Persona encontrada',
      data: buscar,
    };
  }

  async findByEmail(email: string) {
    const persona = await this.personaRepository.findOne({
      where: { correo: email },
      relations: [
        'rol',
        'rol.rolesPermisosOpciones',
        'rol.rolesPermisosOpciones.permiso',
        'rol.rolesPermisosOpciones.opcion',
        'rol.rolesPermisosOpciones.opcion.modulo',
      ],
    });
    return persona;
  }

  async update(id: number, data: UpdatePersonaDto) {
    if (data.contrasena) {
      data.contrasena = await bcrypt.hash(data.contrasena, 10);
    }

    await this.personaRepository.update(id, data);
    const actualizado = await this.personaRepository.findOneBy({ id });
    return {
      message: 'Persona actualizada exitosamente',
      data: actualizado,
    };
  }

  async remove(id: number) {
    await this.personaRepository.delete(id);
    return {
      message: 'Persona eliminada exitosamente',
    };
  }

  async findPersonaCompleta(personaId?: number) {
    let query = `
      SELECT 
        p.id as "personaId",
        p.identificacion,
        p.nombre as "personaNombre",
        p.apellido,
        p.telefono,
        p.correo,
        p.edad,
        p.activo as "personaActiva",
        
        -- Información del Rol
        r.id as "rolId",
        r.nombre as "rolNombre",
        
        -- Información de la Ficha
        f.id as "fichaId",
        f.numero as "fichaNumero",
        f."cantidadAprendices",
        
        -- Información del Titulado
        t.id as "tituladoId",
        t.nombre as "tituladoNombre",
        
        -- Información del Área
        a.id as "areaId",
        a.nombre as "areaNombre",
        
        -- Información del Centro
        c.id as "centroId",
        c.nombre as "centroNombre",
        
        -- Información de la Sede
        s.id as "sedeId",
        s.nombre as "sedeNombre",
        s.direccion as "sedeDireccion",
        
        -- Información del Municipio
        m.id as "municipioId",
        m.nombre as "municipioNombre"
        
      FROM persona p
      LEFT JOIN rol r ON p."rolId" = r.id
      LEFT JOIN ficha f ON p."fichaId" = f.id
      LEFT JOIN titulado t ON f.id = t."fichaId"
      LEFT JOIN area a ON t."areaId" = a.id
      LEFT JOIN area_centro ac ON a.id = ac."areaId"
      LEFT JOIN centro c ON ac."centroId" = c.id
      LEFT JOIN sede s ON c.id = s."centroId"
      LEFT JOIN municipio m ON c."municipioId" = m.id
      WHERE p.activo = true`;
    
    if (personaId) {
      query += ` AND p.id = $1`;
    }
    
    query += ` ORDER BY p.nombre, p.apellido`;
    
    const personas = personaId 
      ? await this.personaRepository.query(query, [personaId])
      : await this.personaRepository.query(query);
    
    return {
      message: personaId ? 'Información completa de persona' : 'Listado completo de personas',
      data: personas,
    };
  }

  async updatePassword(id: number, newPassword: string): Promise<void> {
    await this.personaRepository.update(id, { contrasena: newPassword });
  }
}
