import { db } from '../src/lib/db'
import { users, userSettings } from '../src/lib/db/schema'
import { hashPassword } from '../src/lib/utils/crypto'
import { createId } from '@paralleldrive/cuid2'
import { eq } from 'drizzle-orm'

async function createAdminUser() {
  const email = process.env.ADMIN_EMAIL || 'admin@example.com'
  const password = process.env.ADMIN_PASSWORD || 'admin123'
  const name = process.env.ADMIN_NAME || 'Admin User'

  console.log('Creating admin user...')
  console.log('Email:', email)
  console.log('Password:', password)
  console.log('Name:', name)

  try {
    // Check if admin user already exists
    const existingUsers = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1)
    const existingUser = existingUsers[0]

    if (existingUser) {
      console.log('\n❌ User with this email already exists!')

      // Update to make them admin if they're not already
      if (!existingUser.isAdmin) {
        await db
          .update(users)
          .set({ isAdmin: true })
          .where(eq(users.id, existingUser.id))
        console.log('✅ Updated existing user to admin status')
      } else {
        console.log('ℹ️  User is already an admin')
      }

      return
    }

    // Hash the password
    const passwordHash = await hashPassword(password)

    // Create the admin user
    const newUsers = await db
      .insert(users)
      .values({
        id: createId(),
        email: email.toLowerCase(),
        passwordHash,
        name,
        isAdmin: true,
        registrationPhraseId: null,
      })
      .returning() as { id: string }[]
    const newUser = newUsers[0]

    // Create user settings
    await db.insert(userSettings).values({
      userId: newUser.id,
      displayStyle: 'carousel',
    })

    console.log('\n✅ Admin user created successfully!')
    console.log('\nLogin credentials:')
    console.log('Email:', email)
    console.log('Password:', password)
    console.log('\n⚠️  Please change the password after first login!')
  } catch (error) {
    console.error('\n❌ Error creating admin user:', error)
    throw error
  }
}

createAdminUser()
  .then(() => {
    console.log('\n✅ Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Failed:', error)
    process.exit(1)
  })
