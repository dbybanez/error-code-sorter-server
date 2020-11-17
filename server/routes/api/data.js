const express = require('express')
const mysql = require('mysql')

require('dotenv').config();
const router = express.Router()

let config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB
}

router.get('/data', async (req, res) => {
  // let result = JSON.parse(JSON.stringify('{hahaha}'))
  let result = await getURLS()
  res.json(await result)
})

// Get URLs
async function getURLS() {
  return new Promise (async (resolve, reject) => {
    let connection = mysql.createConnection(config)
    let result = {
      status: false
    }
    try {
      connection.connect((err) => {
        if(err) {
          result.error = {
            code: err.code,
            message: err.message
          }
          result.status = false
          resolve(result)
        } else {
          let query = `SELECT * FROM errorcodes`
          let query_result = []
          connection.query(query, function (error, results, fields) {
            if(error) throw error
            if(results.length > 0) {
              for (result in results) {
                query_result.push(results[result])
              }
              let res = JSON.parse(JSON.stringify(query_result))
              resolve(res)
            } else {
              let res = JSON.parse(JSON.stringify('{ "empty": true }'))
              resolve(res)
            }
          })
        }
      })
    } catch (err) {
      result.error = {
        code: err.code,
        message: err.message
      }
      result.status = false
      resolve(result)
      // resolve(result)
    } finally {
      // if( connection && connection.end ) connection.end()
      // return result.status;
    }
  })
}

module.exports = router