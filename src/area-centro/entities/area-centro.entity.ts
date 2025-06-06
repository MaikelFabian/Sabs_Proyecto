import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Area } from 'src/areas/entities/area.entity';
import { Centro } from 'src/centros/entities/centro.entity';

@Entity('areacentro', { schema: 'public' })
export class Areacentro {
    @Column('uuid', {
        primary: true,
        name: 'idareacentro',
        default: () => 'gen_random_uuid()',
    })
    idareacentro: number;

    @Column('boolean', { name: 'activo', nullable: true, default: () => 'true' })
    activo: boolean | null;

    @Column('timestamp without time zone', {
        name: 'fechacreacion',
        nullable: true,
        default: () => 'now()',
    })
    fechacreacion: Date | null;

    @Column('timestamp without time zone', {
        name: 'fechaactualización',
        nullable: true,
    })
    fechaactualizaciN: Date | null;

    @ManyToOne(() => Area, (area) => area.areacentros)
    @JoinColumn([{ name: 'area', referencedColumnName: 'idarea' }])
    area: Area;

    @ManyToOne(() => Centro, (centro) => centro.areacentros)
    @JoinColumn([{ name: 'centro', referencedColumnName: 'idcentro' }])
    centro: Centro;
}
