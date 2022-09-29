import knex from 'knex'
import config from '../src/config.js'

//------------------------------------------
// productos en MariaDb
const mariaDbClient = knex(config.mariaDb)
    try {
        //Implementar creación de tabla
         await mariaDbClient.schema.dropTableIfExists('articulos');
         await mariaDbClient.schema.createTable('articulos' ,  table => {
            table.increments('id').primary();
            table.string('title').notNullable();
            table.float('price');
            table.string('thumbnail');
        });
        
        
        //Inserto elementos
        const articulos = [
            {title: 'Mirinda'  ,price: 180, thumbnail:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnL-AibR8iEbML_MifNkcnQ0-fljiaSm3vQ-GqKdDrS6NM4VYf1wgIVpZ7E0fequdDQEjZ3SWtiA&usqp=CAc' },
            {title: 'Seven Up', price: 190, thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnL-AibR8iEbML_MifNkcnQ0-fljiaSm3vQ-GqKdDrS6NM4VYf1wgIVpZ7E0fequdDQEjZ3SWtiA&usqp=CAc'},
            {title: 'Pepsi', price: 185, thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnL-AibR8iEbML_MifNkcnQ0-fljiaSm3vQ-GqKdDrS6NM4VYf1wgIVpZ7E0fequdDQEjZ3SWtiA&usqp=CAc'}
        ];
        
         await mariaDbClient('articulos').insert(articulos);
        
        console.log('tabla productos en mariaDb creada con éxito')
    } catch (error) {
        console.log('error al crear tabla productos en mariaDb')
        console.log(error)
    } finally {
         await mariaDbClient.destroy();
    }
    
    



//------------------------------------------
// mensajes en SQLite3
const sqliteClient = knex(config.sqlite3)

    try {
        //Implementar creación de tabla
        await sqliteClient.schema.dropTableIfExists('mensajes');
        await sqliteClient.schema.createTable('mensajes', table => {
            table.increments('id').primary();
            table.string('autor').notNullable();
            table.string('hora');
            table.string('texto');
        });

        const mensaje = [
            {autor: 'Base de Datos'  ,hora: "00:00",texto:'BIENVENIDOS!' },
            {autor: 'Administracion', hora: "00:00", texto: 'AQUI PUEDES ESCRIBIR TUS MENSAJES'}
        ];

        await sqliteClient('mensajes').insert(mensaje);

        console.log('tabla mensajes en sqlite3 creada con éxito')
    } catch (error) {
        console.log('error al crear tabla mensajes en sqlite3')
    } finally {
        sqliteClient.destroy() 
    }