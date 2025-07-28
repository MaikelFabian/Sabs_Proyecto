import { DataSource } from 'typeorm';
import { Persona } from 'src/personas/entities/persona.entity';
import * as bcrypt from 'bcryptjs';
import { Rol } from 'src/roles/entities/role.entity';

export const seedPersona = async (dataSource: DataSource) => {
  const repoPersona = dataSource.getRepository(Persona);
  const repoRol = dataSource.getRepository(Rol);

  const existentes = await repoPersona.count();
  if (existentes > 0) {
    console.log('Ya existen personas en la base de datos, se omite seeding.');
    return;
  }


  const rolAdmin = await repoRol.findOne({ where: { nombre: 'Administrador' } });
  if (!rolAdmin) {
    console.log('No se encontró el rol de Administrador, se omite creación de persona administradora.');
    return;
  }
  
  const salt = bcrypt.genSaltSync(10);
  const contrasenaEncriptada = bcrypt.hashSync('LOUR1234', salt);

  const admin = repoPersona.create({
    identificacion: 'ADMIN001',
    nombre: 'Administrador',
    apellido: 'Sistema',
    correo: 'admin@gmail.com',
    contrasena: contrasenaEncriptada,
    edad: 30,
    rolId: rolAdmin.id, 
    activo: true
  });

  await repoPersona.save(admin);

  console.log('✔ Persona administradora creada correctamente');
};