import { promises } from 'node:fs'
import axios from 'axios'
import { ChatGPTBuilder } from 'src/ChatGPT/ChatGPT'
import { PromptBuilder } from 'src/ChatGPT/Prompt'
import {
  removeAttributes, removeHtmlComments,
  removeTags,
} from 'src/utils/string.util'
import * as cheerio from 'cheerio'
import { CHAT_GPT_API_KEY } from './constants/app.constant'

async function fetch(url: string) {
  const { data } = await axios.get(url)
  return data
}

function pipe<T>(value: T, ...fns: ((value: T) => T)[]) {
  return fns.reduce((acc, fn) => fn(acc), value)
}

async function run() {
  const URL = 'https://recruit.navercorp.com/rcrt/view.do?annoId=3000049&sw=&subJobCdArr=&sysCompanyCdArr=&empTypeCdArr=&entTypeCdArr=&workAreaCdArr='
  const _data = await fetch(URL)
  let data = pipe(_data,
    data => removeTags(data, ['script']),
    data => removeTags(data, ['style']),
    data => removeTags(data, ['head']),
    data => removeTags(data, ['header']),
    data => removeTags(data, ['footer']),
    data => removeHtmlComments(data),
    data => removeAttributes(data, ['style']),
  )

  await promises.writeFile('data/refined.html', data)

  const $ = cheerio.load(data)
  const detailWrap = $('.detail_wrap')

  data = detailWrap.html()

  const gpt = new ChatGPTBuilder(CHAT_GPT_API_KEY)
    .build()

  const prompt = new PromptBuilder()
    .addOption('Command', 'HTML 파일과 TypeScript 인터페이스를 제공해 주시면 해당 HTML 파일을 읽고 제공해 드린 TypeScript 인터페이스를 기반으로 JSON 파일을 생성해줘')
    .addOption('Interface', `interface Job {
  title: string;
  company: string;
  location: string;
  employmentType: string;
  description: string;
  requirements: string[];
  qualifications: string[];
  category: string;
  postedAt: Date;
  deadline: Date;
  applyURL: string;
}`)
    .addOption('Rule', 'JSON String 만 전달해줘!')
    .addOption('Rule', '허위 사실을 기제하지 마!')
    .addOption('Rule', '어떠한 코멘트도 남기지 마!')
    .addContent(data)
    .build()

  const result = await gpt.chat([prompt.getFullPrompt()])
  console.log(result.join('\n'))
}

run()
