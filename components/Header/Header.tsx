'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Menu,
  Avatar,
  UnstyledButton,
  Container,
  Group,
  Burger,
  Button,
  rem,
  Text,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { MantineLogo } from '@mantinex/mantine-logo'
import classes from './Header.module.css'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/app/firebase'
import {
  IconLogout,
  IconHeart,
  IconStar,
  IconMessage,
  IconSettings,
  IconPlayerPause,
  IconTrash,
  IconSwitchHorizontal,
  IconChevronDown,
} from '@tabler/icons-react'
import cx from 'clsx'

const links = [
  { link: '/', label: 'Home' },
  { link: '/About', label: 'About' },
]

export function Header() {
  const pathname = usePathname()
  const [opened, { toggle }] = useDisclosure(false)
  const [userMenuOpened, setUserMenuOpened] = useState(false)
  const [active, setActive] = useState(links[0].link)
  const [firstName, setFirstName] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true)
        getDoc(doc(db, 'users', user.uid)).then((docSnapshot) => {
          if (docSnapshot.exists()) {
            setFirstName(docSnapshot.data().firstName)
          }
        })
      } else {
        setIsLoggedIn(false)
      }
    })

    // Cleanup function
    return () => unsubscribe()
  }, [])

  const items = links.map((link) => (
    <Link
      href={link.link}
      key={link.label}
      className={classes.link}
      data-active={active === link.link || undefined}
      onClick={() => setActive(link.link)}
    >
      {link.label}
    </Link>
  ))

  const isLoginPage = pathname === '/Login'
  const buttonVariant = isLoginPage ? 'blue' : 'default'

  const user = {
    name: { firstName },
    email: 'janspoon@fighter.dev',
  }

  return (
    <header className={classes.header}>
      <Container size='md' className={classes.inner}>
        <MantineLogo size={28} />
        <Group gap={5} visibleFrom='xs'>
          {items}
        </Group>

        <Group visibleFrom='sm'>
          {isLoggedIn ? (
            <Container className={classes.mainSection} size='md'>
              <Group justify='space-between'>
                <Burger
                  opened={opened}
                  onClick={toggle}
                  hiddenFrom='xs'
                  size='sm'
                />

                <Menu
                  width={260}
                  position='bottom-end'
                  transitionProps={{ transition: 'pop-top-right' }}
                  onClose={() => setUserMenuOpened(false)}
                  onOpen={() => setUserMenuOpened(true)}
                  withinPortal
                >
                  <Menu.Target>
                    <UnstyledButton
                      className={cx(classes.user, {
                        [classes.userActive]: userMenuOpened,
                      })}
                    >
                      <Group gap={7}>
                        <Text fw={500} size='sm' lh={1} mr={3}>
                          {user.name.firstName}
                        </Text>
                        <IconChevronDown
                          style={{ width: rem(12), height: rem(12) }}
                          stroke={1.5}
                        />
                      </Group>
                    </UnstyledButton>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Label>Settings</Menu.Label>
                    <Menu.Item
                      leftSection={
                        <IconLogout
                          style={{ width: rem(16), height: rem(16) }}
                          stroke={1.5}
                        />
                      }
                      onClick={() => signOut(auth)}
                    >
                      Logout
                    </Menu.Item>

                    <Menu.Divider />
                  </Menu.Dropdown>
                </Menu>
              </Group>
            </Container>
          ) : (
            <Link href='/Login'>
              <Button
                variant={buttonVariant}
                onClick={() => setActive('/Login')}
              >
                Log in
              </Button>
            </Link>
          )}
        </Group>

        <Burger opened={opened} onClick={toggle} hiddenFrom='xs' size='sm' />
      </Container>
    </header>
  )
}
