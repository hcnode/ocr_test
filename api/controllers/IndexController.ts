import { Controller, Get, Use, Param, Body, Delete, Put, Post, QueryParam, View, Ctx, Response } from "koa-cola/client";
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const writeFile = util.promisify(require("fs").writeFile);
// const uuidv1 = require('uuid/v1');
// const crypto = require('crypto');
// const axios = require('axios');
// const YOUDAO_URL = 'https://openapi.youdao.com/ocr_table'
// const APP_KEY = '71dea750b7e46d4a'
// const APP_SECRET = 'rlBcPXggv8TttAThzKj4DfPEAQ8GrMmG'

// function truncate(q) {
//   if (!q)
//     return q
//   var size = q.length;
//   if (size <= 20)
//     return q
//   else return q.substring(0, 10) + size + q.substr(size - 10);
// }

// function encrypt(signStr) {
//   return crypto.createHash('sha256')
//     .update(signStr)
//     .digest('hex');
// }

var scanningTextMap = {};

@Controller("")
export default class {
  @Get("/")
  @View("index")
  index() { }

  @Post("/callOcr")
  async getFooApi(@Body() body) {
    var base64Data = body.imgBase.replace(/^data:image\/png;base64,/, "");

    await writeFile("out.png", base64Data, 'base64')
    const { stdout, stderr } = await exec(`python callApi.py`);
    return stdout;
  }

  @Post("/saveMap")
  async saveMap(@Body() body){
    scanningTextMap = {...scanningTextMap, ...body.map};
    return {}
  }

  @Get("/fillForm")
  @View("fillForm")
  fillForm() { }

  @Get('/getScanningMap')
  async getScanningMap(@Ctx() ctx){
    ctx.set('Access-Control-Allow-Origin', '*')
    return scanningTextMap;
  }
}
