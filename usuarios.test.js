import {queryAllUsers} from './controllers/usuarios/controller.js';
import {conectarDB} from './db/db.js';
// const suma =(a,b)=>{
// return a+b;
// };
// test('probar que 1+2 es 3',()=>{
//     expect(suma(1,2)).toBe(3);
// });

// test('probar que 1+2 es menor que 5',()=>{
//     expect(suma(1,2)).toBeLessThan(5);
// });

test('query a usuarios devuleve mas de un usuario', (done)=>{
    const callback= (err, res) =>{
        try{
            expect(res.length).toBeGreaterThan(0);
            done();
        } catch (err) {
            done(err);
        }
    };
    const query=()=> queryAllUsers(callback);
    conectarDB(query);
});