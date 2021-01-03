var mysql = require('mysql');

let config1 = {
    host: "localhost",
    user: "root",
    password: "virio0216",
    database: "u7966147_default"
}

let config2 = {
    host: "sedecilliard.com",
    user: "u7966147_root",
    password: "OyusPA!U@elG",
    database: "u7966147_default"
}

let con1 = mysql.createConnection(config1);

let con2 = mysql.createConnection(config2);
con = con1;


class Database {
    constructor(config) {
        this.connection = mysql.createConnection(config);
    }
    query(sql, args) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, args, (err, rows) => {
                if (err)
                    return reject(err);
                resolve(rows);
            });
        });
    }
    close() {
        return new Promise((resolve, reject) => {
            this.connection.end(err => {
                if (err)
                    return reject(err);
                resolve();
            });
        });
    }
}
let database = new Database(config1)

let drs_map = {}

database.query('SELECT * FROM links')
    //
    .then(rows => {
        let drs = rows.filter(x => x.finish_object_class_id == 3 && x.start_object_class_id == 2)
        console.log('target->diary links: ' + drs.length)
        drs.forEach((dr => {
            drs_map[dr.link_finish_object] = true
        }))
        return database.query('SELECT * FROM dairy_records')
    })
    .then(rows => {
        console.log()
        console.log('diary records: ' + rows.length)
        let w_rc = rows.filter(x => drs_map[x.dairy_record_code])
        console.log('working comments: ' + w_rc.length)

        let s_rc = rows.filter(x => !drs_map[x.dairy_record_code])
        console.log("free comments: " + s_rc.length)
        let pred = (w_rc.length + s_rc.length) == rows.length
        console.log('summary check: ' + (pred?'passed':'failed'))

        database.close()
    })