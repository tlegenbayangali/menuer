import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' })

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  console.error(`URL: ${supabaseUrl ? 'OK' : 'MISSING'}`)
  console.error(`KEY: ${supabaseKey ? 'OK' : 'MISSING'}`)
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

interface Menu {
  name: string
  price: number
  description: string
  dishes: string[]
}

const menusData: Menu[] = [
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

async function importData() {
  console.log('🚀 Starting import of banquet menus...')

  try {
    // Get current user (you need to be logged in)
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      console.error('❌ Error: Not authenticated. Please log in first.')
      console.log('You need to set SUPABASE_SERVICE_ROLE_KEY or be logged in')
      return
    }

    console.log(`✅ Authenticated as user: ${user.email}`)

    // Get all unique dishes
    const allDishNames = new Set<string>()
    menusData.forEach(menu => {
      menu.dishes.forEach(dish => allDishNames.add(dish))
    })

    console.log(`📝 Found ${allDishNames.size} unique dishes`)

    // Import dishes
    const dishMap = new Map<string, string>() // name -> id

    for (const dishName of Array.from(allDishNames)) {
      // Check if dish already exists
      const { data: existing } = await supabase
        .from('dishes')
        .select('id')
        .eq('name', dishName)
        .eq('user_id', user.id)
        .single()

      if (existing) {
        dishMap.set(dishName, existing.id)
        console.log(`⏭️  Dish "${dishName}" already exists`)
      } else {
        // Create new dish
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
          console.error(`❌ Error creating dish "${dishName}":`, error)
        } else {
          dishMap.set(dishName, newDish.id)
          console.log(`✅ Created dish: ${dishName}`)
        }
      }
    }

    console.log(`\n📋 Importing ${menusData.length} menus...`)

    // Import menus
    for (const menuData of menusData) {
      // Check if menu already exists
      const { data: existingMenu } = await supabase
        .from('menus')
        .select('id')
        .eq('name', menuData.name)
        .eq('user_id', user.id)
        .single()

      let menuId: string

      if (existingMenu) {
        menuId = existingMenu.id
        console.log(`⏭️  Menu "${menuData.name}" already exists`)

        // Update menu price
        await supabase
          .from('menus')
          .update({
            price: menuData.price,
            description: menuData.description,
          })
          .eq('id', menuId)
      } else {
        // Create new menu
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
          console.error(`❌ Error creating menu "${menuData.name}":`, error)
          continue
        }

        menuId = newMenu.id
        console.log(`✅ Created menu: ${menuData.name} (${menuData.price} ₸)`)
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
          if (!dishId) {
            console.warn(`⚠️  Dish "${dishName}" not found in map`)
            return null
          }
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
          console.error(`❌ Error linking dishes to menu "${menuData.name}":`, error)
        } else {
          console.log(`   🔗 Linked ${menuDishes.length} dishes to menu`)
        }
      }
    }

    console.log('\n🎉 Import completed successfully!')
    console.log(`\n📊 Summary:`)
    console.log(`   - Dishes: ${dishMap.size}`)
    console.log(`   - Menus: ${menusData.length}`)

  } catch (error) {
    console.error('❌ Unexpected error:', error)
    throw error
  }
}

// Run the import
importData()
  .then(() => {
    console.log('\n✨ Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error)
    process.exit(1)
  })