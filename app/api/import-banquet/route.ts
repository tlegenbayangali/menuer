import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

const menusData = [
  {
    name: 'Банкет 7500',
    price: 7500,
    description: '7500 тг/чел + напитки от заказчика',
    dishes: [
      'Бешпармак',
      'Фрикасе с курицей, грибами в сливочном соусе',
      'Ассорти (бедро запеченное с барбекю, чивапчичи, картофель по-деревенски)',
      'KFC с наггетсами и картофельными шариками',
      'Мясная нарезка (казы, сыр, куриный рулет)',
      'Русская закуска (сельдь, картофель, огурцы соленые)',
      'Бутербродики-кораблики с селедкой',
      'Морковь по-корейски',
      'Капуста по-корейски',
      'Корнишоны',
      'Фунчоза по-корейски',
      'Салат Ата-Ана',
      'Салат Ассорти',
      'Салат Цезарь',
      'Салат Алатау',
      'Салат Малибу',
      'Салат Нежность',
      'Салат Дамский каприз',
      'Салат Береза',
      'Салат Любовница',
      'Салат Греческий',
      'Салат Азия',
      'Салат Тбилиси',
      'Хит-салат с хрустящими баклажанами',
      'Фруктовая нарезка',
      'Пироги Балзия',
      'Медовый пласт',
      'Профитроли',
      'Конфеты-сахар',
      'Хлеб',
      'Чай',
      'Молоко',
      'Салфетки',
    ],
  },
  {
    name: 'Банкет 8500',
    price: 8500,
    description: '8500 тг/чел + напитки от заказчика',
    dishes: [
      'Бешпармак',
      'Мясо с овощами',
      'Фрикасе с курицей, грибами в сливочном соусе',
      'Ассорти (бедро запеченное с барбекю, чивапчичи, картофель по-деревенски)',
      'Тефтели',
      'Голубцы',
      'Картофель по-деревенски',
      'Рис',
      'Мясная нарезка расширенная (казы, сыр, утиное филе, куриный рулет)',
      'Куриное ассорти 3 вида (KFC, бедро, крылышки в медово-соевом соусе)',
      'Русская закуска с селедкой',
      'Бутербродики с селедкой',
      'Скумбрия на овощной подушке',
      'Сазан горячий в сливочном соусе',
      'Судак запеченный с овощами',
      'Салат Ата-Ана',
      'Салат Ассорти',
      'Салат Цезарь',
      'Салат Алатау',
      'Салат Малибу',
      'Салат Нежность',
      'Салат Дамский каприз',
      'Салат Береза',
      'Салат Любовница',
      'Салат Греческий',
      'Салат Азия',
      'Салат Тбилиси',
      'Хит-салат с хрустящими баклажанами',
      'Горячая самса',
      'Фруктовая ваза',
      'Пироги Балзия',
      'Медовый пласт',
      'Профитролли',
      'Конфеты-сахар',
      'Хлеб',
      'Чай',
      'Молоко',
      'Салфетки',
    ],
  },
  {
    name: 'Банкет 12000',
    price: 12000,
    description: '12000 тг/чел + напитки от заведения',
    dishes: [
      'Бешпармак',
      'Мясо с овощами',
      'Фрикасе с курицей, грибами в сливочном соусе',
      'Ассорти (бедро запеченное с барбекю, чивапчичи, картофель по-деревенски)',
      'Тефтели',
      'Голубцы',
      'Семга запеченная',
      'Рыбные котлеты',
      'Картофель по-деревенски',
      'Овощи',
      'Мясная нарезка премиум (казы, сыр, язык говяжий, утиное филе)',
      'Курица заливная',
      'Куриное ассорти 3 вида на выбор (KFC, бедро, крылышки, наггетсы, утиное филе)',
      'Скумбрия на овощной подушке',
      'Сазан горячий в сливочном соусе',
      'Судак запеченный с овощами',
      'Рыбная нарезка (семга, масляная рыба, балык)',
      'Салат Ата-Ана',
      'Салат Ассорти',
      'Салат Цезарь с креветками',
      'Салат Алатау',
      'Салат Малибу',
      'Салат Нежность',
      'Салат Дамский каприз',
      'Салат Береза',
      'Салат Любовница',
      'Салат Греческий',
      'Салат Азия',
      'Салат Тбилиси',
      'Хит-салат с хрустящими баклажанами',
      'Горячая самса',
      'Фруктовая ваза',
      'Пироги Балзия',
      'Медовый пласт',
      'Профитролли',
      'Конфеты-сахар',
      'Хлеб',
      'Чай',
      'Молоко',
      'Салфетки',
      'Водка',
      'Кола',
      'Вода негаз',
      'Вода газ',
      'Домашний компот',
    ],
  },
]

export async function POST() {
  const supabase = await createClient()

  try {
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const logs: string[] = []
    logs.push('🚀 Starting import...')

    // Get all unique dishes
    const allDishNames = new Set<string>()
    menusData.forEach(menu => {
      menu.dishes.forEach(dish => allDishNames.add(dish))
    })

    logs.push(`📝 Found ${allDishNames.size} unique dishes`)

    // Import dishes
    const dishMap = new Map<string, string>()

    for (const dishName of Array.from(allDishNames)) {
      const { data: existing } = await supabase
        .from('dishes')
        .select('id')
        .eq('name', dishName)
        .eq('user_id', user.id)
        .single()

      if (existing) {
        dishMap.set(dishName, existing.id)
        logs.push(`⏭️  Dish "${dishName}" already exists`)
      } else {
        const { data: newDish, error } = await supabase
          .from('dishes')
          .insert({
            name: dishName,
            description: null,
            image_url: null,
            user_id: user.id,
          })
          .select('id')
          .single()

        if (error) {
          logs.push(`❌ Error creating dish "${dishName}": ${error.message}`)
        } else {
          dishMap.set(dishName, newDish.id)
          logs.push(`✅ Created dish: ${dishName}`)
        }
      }
    }

    logs.push(`\n📋 Importing ${menusData.length} menus...`)

    // Import menus
    for (const menuData of menusData) {
      const { data: existingMenu } = await supabase
        .from('menus')
        .select('id')
        .eq('name', menuData.name)
        .eq('user_id', user.id)
        .single()

      let menuId: string

      if (existingMenu) {
        menuId = existingMenu.id
        logs.push(`⏭️  Menu "${menuData.name}" already exists`)

        await supabase
          .from('menus')
          .update({
            price: menuData.price,
            description: menuData.description,
          })
          .eq('id', menuId)
      } else {
        const { data: newMenu, error } = await supabase
          .from('menus')
          .insert({
            name: menuData.name,
            description: menuData.description,
            price: menuData.price,
            user_id: user.id,
          })
          .select('id')
          .single()

        if (error) {
          logs.push(`❌ Error creating menu "${menuData.name}": ${error.message}`)
          continue
        }

        menuId = newMenu.id
        logs.push(`✅ Created menu: ${menuData.name} (${menuData.price} ₸)`)
      }

      // Clear existing dish assignments
      await supabase
        .from('menu_dishes')
        .delete()
        .eq('menu_id', menuId)

      // Link dishes to menu
      const menuDishes = menuData.dishes
        .map((dishName, index) => {
          const dishId = dishMap.get(dishName)
          if (!dishId) return null
          return {
            menu_id: menuId,
            dish_id: dishId,
            position: index,
          }
        })
        .filter(Boolean)

      if (menuDishes.length > 0) {
        const { error } = await supabase
          .from('menu_dishes')
          .insert(menuDishes)

        if (error) {
          logs.push(`❌ Error linking dishes: ${error.message}`)
        } else {
          logs.push(`   🔗 Linked ${menuDishes.length} dishes`)
        }
      }
    }

    logs.push('\n🎉 Import completed!')
    logs.push(`📊 Summary: ${dishMap.size} dishes, ${menusData.length} menus`)

    return NextResponse.json({ success: true, logs })

  } catch (error) {
    console.error('Import error:', error)
    return NextResponse.json(
      { error: 'Import failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}