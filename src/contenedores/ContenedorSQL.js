import knex from 'knex'

class ContenedorSQL {

    constructor(config, tabla) {
        this.knex = knex(config)
        this.tabla = tabla
    }

    async getById(id) {
        try {
            const producto = await this.getAll();
            const productoById = producto.find(p => p.id == id);
            return productoById;
        } catch (error) {
            console.log('Hubo un error en getById')
        }
    }

    async getAll() {
        try {
            const productos = await this.knex(this.tabla).select('*');
            return productos;
        } catch (error) {
            console.log('Hubo un error en getAll')
        }
    }

    async save(elem) {
        try {
            await this.knex(this.tabla).insert(elem);
        } catch (error) {
            console.log('Hubo un error en save');
        }
    }

    async update(elem, id) {
        try {
            await this.knex.from(this.tabla).where('id', id).update(elem);
        } catch (error) {
            console.log('Hubo un error en update');
        }
    }



    async deleteById(id) {
        try {
            await this.knex.from(this.tabla).where('id', id).del();
        } catch (error) {
            console.log('Hubo un error en deleteById');
        }
    }

    async deleteAll() {
        try {
            await this.knex.from(this.tabla).del();
        } catch (error) {
            console.log('Hubo un error en deleteAll')
        }
    }

    async desconectar() {
        try {
            await this.knex.destroy()
        } catch (error) {
            console.log('Hubo un error en desconeccion');   
        }
        
    }
}

export default ContenedorSQL