import { promises } from 'node:fs'
import axios from 'axios'
import * as cheerio from 'cheerio'
import { ChatGPTBuilder } from 'src/ChatGPT/ChatGPT'
import { CHAT_GPT_API_KEY } from './constants/app.constant'

async function fetch(url: string) {
  const { data } = await axios.get(url)
  return data
}

async function run() {
  const URL = 'https://recruit.navercorp.com/rcrt/view.do?annoId=30001373'
  // const data = await fetch(URL)
  const data = await promises.readFile('naver_30001373.html', 'utf-8')

  const $ = cheerio.load(data)
  const detailBox = $('.sub_container')

  const gpt = new ChatGPTBuilder(CHAT_GPT_API_KEY)
    .build()

  const response = await gpt.chat(['hello world'])
  console.log(response)
}

run()
