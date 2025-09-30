import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { type, name, items } = await request.json()

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key не настроен' },
        { status: 500 }
      )
    }

    let prompt = ''

    if (type === 'dish') {
      // Генерация описания блюда на основе ингредиентов
      const ingredientsList = items?.map((i: any) =>
        `${i.name} (${i.quantity} ${i.unit})`
      ).join(', ') || ''

      prompt = `Создай аппетитное и привлекательное описание блюда для меню ресторана.

Название блюда: ${name}
Ингредиенты: ${ingredientsList || 'не указаны'}

Требования:
- Описание должно быть на русском языке
- Объем: 2-3 предложения (50-80 слов)
- Подчеркни уникальные особенности блюда
- Используй яркие эпитеты
- Упомяни ключевые ингредиенты
- Стиль: элегантный, но не перегруженный
- НЕ используй emoji

Верни только текст описания без дополнительных пояснений.`
    } else if (type === 'menu') {
      // Генерация описания меню на основе блюд
      const dishesList = items?.map((d: any) => d.name).join(', ') || ''

      prompt = `Создай привлекательное описание меню для ресторана.

Название меню: ${name}
Блюда в меню: ${dishesList || 'не указаны'}

Требования:
- Описание должно быть на русском языке
- Объем: 2-3 предложения (50-80 слов)
- Опиши концепцию и характер меню
- Подчеркни разнообразие и особенности
- Упомяни ключевые блюда
- Стиль: элегантный и профессиональный
- НЕ используй emoji

Верни только текст описания без дополнительных пояснений.`
    } else {
      return NextResponse.json(
        { error: 'Неверный тип запроса' },
        { status: 400 }
      )
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Ты профессиональный копирайтер, специализирующийся на создании описаний для ресторанных меню.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 200,
    })

    const description = completion.choices[0]?.message?.content?.trim()

    if (!description) {
      return NextResponse.json(
        { error: 'Не удалось сгенерировать описание' },
        { status: 500 }
      )
    }

    return NextResponse.json({ description })
  } catch (error: any) {
    console.error('AI Generation Error:', error)
    return NextResponse.json(
      { error: error.message || 'Ошибка генерации описания' },
      { status: 500 }
    )
  }
}