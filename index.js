var mysql = require('mysql');

var con1 = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "virio0216",
    database: "u7966147_default"
});

con2 = mysql.createConnection({
    host: "sedecilliard.com",
    user: "u7966147_root",
    password: "OyusPA!U@elG",
    database: "u7966147_default"
});
con = con1;
let pr = []
pr[0] = function (err, result, fields) {
    if (err) throw err
}

let process_map = [sql, process_results]
con.connect(function (err) {
    if (err) throw err;
    let sql = "SELECT * FROM targets JOIN `objects` ON `target_code` = `object_code`"
    let process_results = function (err, result, fields) {
        if (err) throw err;
        let xs = result;
        let yyk = xs.filter(x => x.user_code == 116)
        let total = yyk.length
        console.log('total yyk\'s goals: ' + total)

        let active = x => x.target_canceled_timestamp == null
            && x.target_reached_timestamp == null
            && x.target_archived_timestamp == null
        let achived = x => x.target_reached_timestamp
        let archived = x => x.target_archived_timestamp
        let canceled = x => x.target_canceled_timestamp
        let arcan = x => achived(x) && canceled(x)
        let strict_achived = x => achived(x) && !canceled(x)
        let strict_canceled = x => !achived(x) && canceled(x)
        let active_xs = yyk.filter(active)
        console.log('total active: ' + active_xs.length)

        let non_active = yyk.filter(x => !active(x))
        console.log('total non-active: ' + non_active.length)
        console.log('control total: ' + (active_xs.length + non_active.length))
        console.log((active_xs.length + non_active.length) == yyk.length)

        let ys = yyk.filter(arcan)
        let arcan_length = ys.length
        console.log('arcan: ' + arcan_length)

        let zs = yyk.filter(strict_achived)
        let japon = zs.length
        console.log('japon: ' + japon)

        let ws = yyk.filter(strict_canceled)
        let harakiri = ws.length
        console.log('harakiri: ' + harakiri)

        let total_calculated = active_xs.length + japon + harakiri + arcan_length
        console.log(total + " == " + total_calculated)
        console.log(total == total_calculated)
        let autos = ys.filter(y => (y.target_description == 'autogenerated'))
        let non_autos = ys.filter(y => y.target_description != 'autogenerated')
        //console.log(autos.length)
        console.log(non_autos.length)
        non_autos.slice(0, 100).forEach(x => console.log(x.target_brief))
        console.log(non_autos[0].target_brief)
        //non_autos.forEach(y => console.log(y.target_brief))
        con.end()
    }
    con.query(sql, process_results);
});