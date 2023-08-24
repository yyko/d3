const mysql = require('mysql2/promise')
const { genObjHash, hash, parseDuration } = require('./utils.js')
const { CALLS_EDIT_HISTORY_FIELDS, ROSTER_FIELDS, REFERENCE_FIELDS, DECISION_QUEUE_FIELDS, CALL_FIELDS } = require('./schemes')

class Db {
  constructor (user, password, dbName, host) {
    this.user = user
    this.password = password
    this.dbName = dbName
    this.conn = {}
    this.pool = ''
    this.host = host || 'localhost'
  }

  async connect () {
    const pool = mysql.createPool({
      host: this.host,
      port: 3306,
      user: this.user,
      password: this.password,
      database: this.dbName,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    })
    this.conn.execute = async (...args) => {
      return await pool.query.apply(pool, args)
    }
    this.pool = pool
  }

  async query (sql) {
    const [rows] = await this.conn.execute(sql)
    return rows
  }

  async getCallsById (ids) {
    const select = 'SELECT * from calls'
    const where = `WHERE callId in (${ids.map(id => `'${id}'`).join(', ')})`
    const sql = [select, where].join(' ')
    const [rows] = await this.conn.execute(sql)
    return rows
  }

  async getClients () {
    const sql = 'SELECT * from roster'
    const [rows] = await this.conn.execute(sql)
    return rows
  }

  async getClientName (clientId) {
    const sql = 'SELECT ClientName as clientName from roster where spreadsheetId = ?'
    const [rows] = await this.conn.execute(sql, [clientId])
    return rows[0].clientName
  }

  async updateCall ({ callId, address }) {
    const update = 'UPDATE calls'
    const set = 'SET propertyAddress = ?'
    const where = 'WHERE callId = ?'
    const sql = [update, set, where].join(' ')
    await this.conn.execute(sql, [address, callId])
  }

  async updateCallDuration ({ callId, duration }) {
    const update = 'UPDATE calls'
    const set = 'SET Duration = ?'
    const where = 'WHERE callId = ?'
    const sql = [update, set, where].join(' ')
    await this.conn.execute(sql, [duration, callId])
  }

  async addHistory ({ callId, address }) {
    const select = 'INSERT INTO callsEditHistory (callId, address)'
    const values = 'VALUES (?, ?)'
    const sql = [select, values].join(' ')
    const [rows] = await this.conn.execute(sql, [callId, address])
    return rows[0]
  }

  async markReferenceRemoved (refId) {
    const update = 'UPDATE reference'
    const set = 'SET removed = TRUE'
    const where = 'WHERE refId = ?'
    const sql = [update, set, where].join(' ')
    const [rows] = await this.conn.execute(sql, [refId])
    return rows[0]
  }

  async updateReference ({ refId, propertyAddress }) {
    const update = 'UPDATE reference'
    const set = 'SET propertyAddress = ?'
    const where = 'WHERE refId = ?'
    const sql = [update, set, where].join(' ')
    await this.conn.execute(sql, [propertyAddress, refId])
  }

  async updateDecisionRef ({ refIdToUpdate, newRefId }) {
    const update = 'UPDATE decisions'
    const set = 'SET refId = ?'
    const where = 'WHERE refId = ?'
    const sql = [update, set, where].join(' ')
    const [rows] = await this.conn.execute(sql, [newRefId, refIdToUpdate])
    return rows
  }

  async updateDecision (a) {
    const decisionId = a.decisionId
    delete a.decisionId
    const fields = Object.keys(a)
    const update = 'UPDATE decisions'
    const set = 'SET ' + fields.map(field => `${field}=?`).join(', ')
    const where = 'WHERE decisionId = ?'
    const sql = [update, set, where].join(' ')
    const vals = fields.map(field => a[field])
    vals.push(decisionId)
    const [rows] = await this.conn.execute(sql, vals)
    return rows
  }

  async updateDecisionStatus ({ decisionId, status }) {
    const sql = 'UPDATE decisions SET status = ? WHERE decisionId = ?'
    const [rows] = await this.conn.execute(sql, [status, decisionId])
    return rows
  }

  async getOffenders ({ from, to }) {
    const select = 'SELECT agent, count(decisionId) as q FROM decisions'
    const clauses = ['status = \'VIOLATION\'']
    const vals = []
    if (from) {
      clauses.push('DATE_FORMAT(date, \'%Y-%m-%d\') >= ?')
      vals.push(from)
    }
    if (to) {
      clauses.push('DATE_FORMAT(date, \'%Y-%m-%d\') <= ?')
      vals.push(to)
    }
    const where = 'where ' + clauses.join(' and ')
    const order = 'order by q desc'
    const group = 'group by agent'
    const sql = [select, where, group, order].join(' ')
    const [rows] = await this.conn.execute(sql, vals)
    return rows
  }

  async markApplied (id) {
    const update = 'UPDATE decisions'
    const set = 'SET applied = TRUE'
    const where = 'WHERE decisionId = ?'
    const sql = [update, set, where].join(' ')
    await this.conn.execute(sql, [id])
  }

  async getCorrections (a) {
    const status = ['VIOLATION', 'DISSMISSED', 'PROCESSED']
    const applied = false
    const sortType = 'skill'
    const sortOrder = true
    return await this.getDetailedDecisions(Object.assign(a, { status, applied, sortOrder, sortType }))
  }

  async getViolations (clientId) {
    return await this.getDetailedDecisions({ clientId, status: 'VIOLATION' })
  }

  async getDecisionsForRefId ({ refId, status }) {
    const ps = [
      'decisionId',
      'DATE_FORMAT(date, \'%Y-%m-%d\') as date',
      'time',
      'decisions.propertyAddress',
      'decisions.companySkill',
      'similarity',
      'reference.propertyAddress as reference'
    ]
    const select = `select ${ps.join(',')} from decisions`
    const clauses = ['decisions.refId = ?']
    const vals = [refId]
    if (status) {
      clauses.push('status = ?')
      vals.push(status)
    }
    const join = 'INNER JOIN reference ON decisions.refId = reference.refId'
    const where = 'where ' + clauses.join(' and ')
    const order = 'order by date, time'
    const sql = [select, join, where, order].join(' ')
    const [rows] = await this.conn.execute(sql, vals)
    return rows
  }

  async getDecisionsForClient ({ clientId, status }) {
    const ps = [
      'decisionId',
      'DATE_FORMAT(date, \'%Y-%m-%d\') as date',
      'time',
      'decisions.propertyAddress',
      'reference.propertyAddress as reference'
    ]
    const select = `select ${ps.join(',')} from decisions`
    const clauses = ['decisions.clientId = ?']
    const vals = [clientId]
    if (status) {
      clauses.push('status = ?')
      vals.push(status)
    }
    const join = 'INNER JOIN reference ON decisions.refId = reference.refId'
    const where = 'where ' + clauses.join(' and ')
    const order = 'order by date, time'
    const sql = [select, join, where, order].join(' ')
    const [rows] = await this.conn.execute(sql, vals)
    return rows
  }

  async getAllDecisions ({ clientId, status }) {
    const ps = [
      'decisionId',
      'DATE_FORMAT(date, \'%Y-%m-%d\') as date',
      'time',
      'decisions.propertyAddress',
      'decisions.clientId',
      'decisions.status',
      'decisions.applied',
      'decisions.refId as dRefId',
      'reference.refId as rRefId'
    ]
    const select = `select ${ps.join(',')} from decisions`
    const clauses = []
    const vals = []
    if (clientId) {
      clauses.push('decisions.clientId = ?')
      vals.push(clientId)
    }
    if (status) {
      clauses.push('status = ?')
      vals.push(status)
    }
    const join = 'LEFT JOIN reference ON decisions.refId = reference.refId'
    const where = clauses.length ? 'where ' + clauses.join(' and ') : ''
    const order = 'order by date, time'
    const sql = [select, join, where, order].join(' ')
    const [rows] = await this.conn.execute(sql, vals)
    return rows
  }

  async getDecision (id) {
    const sql = 'select * from decisions where decisionId = ?'
    const [rows] = await this.conn.execute(sql, [id])
    return rows[0]
  }

  async getDetailedDecisions (a) {
    const ps = [
      'decisionId',
      'DATE_FORMAT(decisions.date, \'%Y-%m-%d\') as date',
      'decisions.time',
      'reference.propertyAddress as reference',
      'decisions.propertyAddress',
      'calls.Agent as agent',
      'calls.CallerType as callerType',
      'calls.CompanySkill as companySkill',
      'calls.PhoneNumber as phoneNumber'
    ]
    const inners = [
      'INNER JOIN reference ON decisions.refId = reference.refId',
      'INNER JOIN calls ON decisions.decisionId = calls.CallId'
    ]
    const join = inners.join(' ')
    return await this.getDecisions_({ ...a, ps, join })
  }

  async getDecisions (a) {
    const { noRef } = a
    const ps = [
      'decisionId',
      'decisions.clientId',
      'DATE_FORMAT(decisions.date, \'%Y-%m-%d\') as date',
      'decisions.time',
      'CONCAT(DATE_FORMAT(decisions.date, \'%Y-%m-%d \'), DATE_FORMAT(decisions.time, \'%H:%i:%s\')) as timestamp',
      'decisions.propertyAddress',
      'decisions.companySkill',
      'decisions.similarity',
      'decisions.agent'
    ]
    let join
    if (noRef) {
      ps.push('calls.PhoneNumber as phoneNumber')
      join = 'INNER JOIN calls ON calls.callId = decisions.decisionId'
    } else {
      ps.push('reference.propertyAddress as reference')
      join = 'INNER JOIN reference ON decisions.refId = reference.refId'
    }
    return await this.getDecisions_({ ...a, ps, join })
  }

  async getDecisions_ (a) {
    const { ps, join, clientId, from, to, status, noRef, sortType, sortOrder, propertyAddress, applied } = a
    const select = `select ${ps.join(',')} from decisions`
    const clauses = []
    let vals = []
    if (from) {
      clauses.push('date >= ?')
      vals.push(from)
    }
    if (to) {
      clauses.push('date <= ?')
      vals.push(to)
    }
    if (status) {
      const xs = typeof status === 'string' ? [status] : status
      const statClause = `( ${xs.map(x => 'status = ?').join(' OR ')} )`
      clauses.push(statClause)
      vals = vals.concat(status)
    }
    if (clientId) {
      clauses.push('decisions.clientId = ?')
      vals.push(clientId)
    }
    if (noRef) {
      clauses.push('decisions.refId = \'\'')
    }
    if (propertyAddress) {
      clauses.push('decisions.propertyAddress = ?')
      vals.push(propertyAddress)
    }
    if (applied !== undefined) {
      clauses.push('applied = ?')
      vals.push(applied)
    }
    let desc = 'desc'
    let orders = ['timestamp', desc].join(' ')
    if (sortType && sortOrder !== undefined) {
      desc = sortOrder === true ? '' : 'desc'
      switch (sortType) {
        case 'date':
          orders = ['timestamp', desc].join(' ')
          break
        case 'skill':
          orders = ['companySkill', desc].join(' ')
          break
        case 'address':
          orders = ['propertyAddress', desc].join(' ')
          break
      }
    }
    const order = ['order by', orders].join(' ')
    const where = clauses.length ? 'where ' + clauses.join(' and ') : ''
    const sql = [select, join, where, order].join(' ')
    const [rows] = await this.conn.execute(sql, vals)
    return rows
  }

  async getReference (refId) {
    const select = 'select * from reference'
    const where = 'where refId = ?'
    const sql = [select, where].join(' ')
    const [rows] = await this.conn.execute(sql, [refId])
    return rows[0]
  }

  async getReferences ({ companySkill, clientId, sortType, sortOrder, propertyAddress, limit, offset }) {
    const select = 'select LENGTH(propertyAddress) as length, reference.*, roster.ClientName as clientName, roster.SpreadsheetId as clientId from reference'
    const inner = 'INNER JOIN roster ON roster.SpreadsheetId = reference.clientId'
    const clauses = ['removed = FALSE and propertyAddress <>\'N/A\'']
    const shapers = []
    const vals = []
    if (propertyAddress) {
      clauses.push('propertyAddress = ?')
      vals.push(propertyAddress)
    }
    if (companySkill) {
      clauses.push('companySkill = ?')
      vals.push(companySkill)
    }
    if (clientId) {
      clauses.push('clientId = ?')
      vals.push(clientId)
    }
    if (limit) {
      shapers.push('limit ?')
      vals.push(limit)
    }
    if (offset) {
      shapers.push('offset ?')
      vals.push(offset)
    }
    const where = clauses.length ? 'where ' + clauses.join(' and ') : ''
    let orders = ['propertyAddress']
    if (sortType && sortOrder !== undefined) {
      const desc = sortOrder === true ? '' : 'desc'
      switch (sortType) {
        case 'name':
          orders = ['clientName', desc].join(' ')
          break
        case 'alphanumeric':
          orders = ['propertyAddress', desc].join(' ')
          break
        case 'length':
          orders = ['LENGTH(propertyAddress)', desc].join(' ')
          break
      }
    }
    const tail = shapers.join(' ')
    const order = ['order by', orders].join(' ')
    const sql = [select, inner, where, order, tail].join(' ')
    const [rows] = await this.conn.execute(sql, vals)
    return rows
  }

  // returns all calls despite the content of address (empty of full)
  // and field named for full match with DCL spreadsheet
  async getAllCalls (a) {
    const { from, to } = a
    const ps = [
      'CONCAT(DATE_FORMAT(date, \'%Y-%m-%d \'), DATE_FORMAT(time, \'%H:%i:%s\')) as Timestamp',
      'DATE_FORMAT(date, \'%Y-%m-%d\') as date',
      'CallerType as "Caller Type"',
      'TypeOfCall as Department',
      'MainReason as "Main Reason For The Call"',
      'ActionTaken as "Action Taken"',
      'Duration as "Call Duration"'
    ]
    const select = `select ${ps.join(',')} from calls`
    const clauses = []
    const vals = []
    if (from) { clauses.push('date >= ?'); vals.push(from) }
    if (to) { clauses.push('date <= ?'); vals.push(to) }
    const where = 'where ' + clauses.join(' and ')
    const sql = [select, where].join(' ')
    const [rows] = await this.conn.execute(sql, vals)
    return rows
  }

  // returns filtered calls without empty addresses in no condition for address given
  async getCalls (a) {
    const { from, to, address, clientId, companySkill } = a
    const ps = [
      'CallId as callId',
      'ClientId as clientId',
      'DATE_FORMAT(date, \'%Y-%m-%d\') as date',
      'CONCAT(DATE_FORMAT(date, \'%Y-%m-%d \'), DATE_FORMAT(time, \'%H:%i:%s\')) as timestamp',
      'time',
      'calls.CallerType as callerType',
      'CompanySkill as companySkill',
      'roster.clientName as clientName',
      'PropertyAddress as propertyAddress',
      'PhoneNumber as phoneNumber',
      'Agent as agent'
    ]
    const select = `select ${ps.join(',')} from calls`
    const join = 'INNER JOIN roster ON calls.clientId = roster.spreadsheetID'
    const clauses = []
    const vals = []
    if (address) {
      clauses.push('propertyAddress = ?')
      vals.push(address)
    } else {
      clauses.push('propertyAddress <>\'\'')
    }
    if (from) {
      clauses.push('date >= ?')
      vals.push(from)
    }
    if (to) {
      clauses.push('date <= ?')
      vals.push(to)
    }
    if (clientId) {
      clauses.push('clientId = ?')
      vals.push(clientId)
    }
    if (companySkill) {
      clauses.push('companySkill = ?')
      vals.push(companySkill)
    }
    const where = 'where ' + clauses.join(' and ')
    const order = 'order by companySkill, timestamp'
    const sql = [select, join, where, order].join(' ')
    const [rows] = await this.conn.execute(sql, vals)
    return rows
  }

  async getInvoicingData ({ month, year }) {
    const select = "select roster.clientName as name, DATE_FORMAT(date, '%Y-%m-%d') as date, CompanySkill as skill, contactSource as source, count(callId) as quantity, sum(duration) as talkTime, avg(duration) as average, sum(AcwTime) as acwTime, avg(AcwTime) as averageAcwTime from calls"
    const join = 'INNER JOIN roster ON calls.clientId = roster.spreadsheetID'
    const where = "where YEAR(date) = ? and MONTH(date) = ? and (not callerType = 'Invalid Calls') and CallerType NOT LIKE 'test%'"
    const group = 'GROUP BY date, ClientId, CompanySkill, contactSource ORDER BY roster.clientName, date'
    const order = 'order by date, skill'
    const sql = [select, join, where, group, order].join(' ')
    const [rows] = await this.conn.execute(sql, [year, month])
    return rows
  }

  async getEmergencyData (from, to) {
    const select = 'select CallerType as type, count(CallerType) as quantity, sum(Duration) as duration from calls'
    const where = `where TypeOfCall = 'Emergency Repairs' and date >= '${from}' and date <= '${to}'`
    const group = 'group by CallerType'
    const sql = [select, where, group].join(' ')
    const [rows] = await this.conn.execute(sql)
    return rows
  }

  async getEmergencyDataByClient (from, to) {
    const select = 'select roster.clientName as name, CallerType as type, count(CallerType) as quantity, sum(Duration) as duration from calls'
    const join = 'INNER JOIN roster ON calls.clientId = roster.spreadsheetID'
    const where = `where TypeOfCall = 'Emergency Repairs' and date >= '${from}' and date <= '${to}'`
    const group = 'group by name, type'
    const order = 'order by name'
    const sql = [select, join, where, group, order].join(' ')
    const [rows] = await this.conn.execute(sql)
    return rows
  }

  async tableExists (name) {
    const sql = `SHOW tables LIKE '${name}'`
    const [rows] = await this.conn.execute(sql)
    return rows.length > 0
  }

  async getSize (spreadsheetId) {
    const sql = 'SELECT COUNT(CallId) as size from calls WHERE `clientId` = ?'
    const res = await this.conn.execute(sql, [spreadsheetId])
    return res[0][0].size
  }

  async addDecisionToQueue (a) {
    let { status, decisionId, date, time, agent, clientId, companySkill, refId, propertyAddress, similarity } = a
    const clearedAddress = propertyAddress.trim()
    agent = agent || ''
    let sql = ''
    sql += 'INSERT INTO decisions (status, decisionId, date, time, agent, clientId, companySkill, refId, propertyAddress, similarity) '
    sql += 'VALUES( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) '
    sql += 'ON DUPLICATE KEY UPDATE refId=?'
    await this.conn.execute(sql, [status, decisionId, date, time, agent, clientId, companySkill, refId, clearedAddress, similarity, refId])
  }

  async addReference (a) {
    const { clientId, propertyAddress } = a
    const clearedAddress = propertyAddress.trim()
    const companySkill = 'SINGLETON'
    const refId = genObjHash(a)
    let sql = ''
    sql += 'INSERT INTO reference (refId, clientId, companySkill, propertyAddress) '
    sql += 'VALUES( ?, ?, ?, ?) '
    sql += 'ON DUPLICATE KEY UPDATE clientId=?'
    await this.conn.execute(sql, [refId, clientId, companySkill, clearedAddress, clientId])
    return refId
  }

  async addOrUpdateRosterRecord (spreadsheetId, clientName, llsOnly) {
    let sql = ''
    sql += 'INSERT INTO roster (SpreadsheetId, ClientName, LlsOnly) '
    sql += `VALUES("${spreadsheetId}", "${clientName}", ${llsOnly}) `
    sql += `ON DUPLICATE KEY UPDATE LlsOnly=${llsOnly}`
    await this.conn.execute(sql)
  }

  async addCalls (clientId, rows) {
    const fields = CALL_FIELDS.ids.join(', ')
    let sql = ''
    sql += `INSERT INTO calls (${fields}) `
    const values = rows.map(xs => {
      const n = xs.length
      const acwIdx = n - 3
      const [date, time] = xs[0].split(' ')
      const duration = isNaN(parseDuration(xs[1])) ? 0 : parseDuration(xs[1])
      const acwDuration = isNaN(parseDuration(xs[acwIdx])) ? 0 : parseDuration(xs[acwIdx])
      const callId = hash([clientId].concat(xs).join(''))
      const ys = [callId, clientId]
        .concat([date, time, duration])
        .concat(xs.slice(2, acwIdx))
        .concat([acwDuration])
        .concat(xs.slice(acwIdx + 1, n))
      const vs = ys.map(x => mysql.escape(x)).join(', ')
      return `(${vs})`
    }).join(',')
    sql += `VALUES ${values}`
    sql += ` ON DUPLICATE KEY UPDATE ClientId='${clientId}'`
    const res = await this.conn.execute(sql)
    return res
  }

  async createCallsEditHistoryTable () {
    await this.createTableByScheme(CALLS_EDIT_HISTORY_FIELDS)
  }

  async createReferenceTable () {
    await this.createTableByScheme(REFERENCE_FIELDS)
  }

  async createRoster () {
    await this.createTableByScheme(ROSTER_FIELDS)
  }

  async createCallsTable () {
    await this.createTableByScheme(CALL_FIELDS)
  }

  async createDecisionsTable () {
    await this.createTableByScheme(DECISION_QUEUE_FIELDS)
  }

  async createTableByScheme (FIELDS) {
    let sql
    const desc = FIELDS.ids.map(id => [id, FIELDS.byId[id]].join(' ')).join(',')
    if (FIELDS.primary) {
      sql = `CREATE TABLE ${FIELDS.name} (${desc}, PRIMARY KEY ( ${FIELDS.primary}))`
    } else {
      sql = `CREATE TABLE ${FIELDS.name} (${desc})`
    }
    await this.conn.execute(sql)
  }

  async getAddresses (year, month) {
    const select = 'select roster.clientName as name, propertyaddress as address, companySkill as skill from calls'
    const join = 'INNER JOIN roster ON calls.clientId = roster.spreadsheetID'
    const where = `where DATE_FORMAT(date, '%Y-%m') >= '${year}-${month}'`
    const group = 'group by name, skill, address'
    const order = 'order by name, skill, address'
    const sql = [select, join, where, group, order].join(' ')
    const [rows] = await this.conn.execute(sql)
    return rows
  }

  async getBillingData (year, month, clientId) {
    const select = "select DATE_FORMAT(date, '%Y-%m-%d') as date, typeOfCall, contactSource, count(callId) as qOfCalls, sum(duration) as duration from calls"
    const where = `where YEAR(date) = '${year}' and MONTH(date) = '${month}' and not (callerType = 'Invalid Calls') and CallerType NOT LIKE 'test%' and clientId = '${clientId}'`
    const group = 'group by date, typeOfCall, contactSource'
    const sort = 'order by date'
    const sql = [select, where, group, sort].join(' ')
    return await this.conn.execute(sql)
  }

  async close () {
    await this.pool.end()
  }
}

module.exports = { Db }
