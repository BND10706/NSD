'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
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
import classes from './Header.module.css'
import {
  IconLogout,
  IconChevronDown,
  IconUserCircle,
} from '@tabler/icons-react'
import cx from 'clsx'
import Image from 'next/image'
import MyLogo from '../../public/NSDLogo.png'
import Cookies from 'js-cookie'
import { useUser } from '../../context/UserContext'

const links = [
  { link: '/', label: 'Home' },
  { link: '/About', label: 'About' },
  { link: '/Assessments', label: 'Assessments', private: true },
]

export function Header() {
  const pathname = usePathname()
  const [opened, { toggle }] = useDisclosure(false)
  const [userMenuOpened, setUserMenuOpened] = useState(false)
  const [active, setActive] = useState(links[0].link)
  const { user, setUser } = useUser()
  const router = useRouter()

  const loadUserFromCookie = () => {
    const storedUser = Cookies.get('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }

  useEffect(() => {
    loadUserFromCookie()
  }, [])

  function handleLogout() {
    setUser(null) // Remove the user's data from your UserContext
    Cookies.remove('token') // Remove the JWT token from your cookies
    Cookies.remove('user') // Remove the user from your cookies
    router.push('/')
  }

  const handleProfileRedirect = () => {
    router.push('/Profile')
  }

  const items = links.map((link) => {
    // If the link is private and there's no user, don't render it
    if (link.private && !user) {
      return null
    }

    return (
      <Link
        href={link.link}
        key={link.label}
        className={classes.link}
        data-active={pathname === link.link || undefined}
        onClick={() => setActive(link.link)}
      >
        {link.label}
      </Link>
    )
  })

  const isLoginPage = pathname === '/Login'
  const buttonVariant = isLoginPage ? 'blue' : 'default'

  return (
    <header className={classes.header}>
      <Container size='md' className={classes.inner}>
        <Image src={MyLogo} alt='My Logo' width={70} height={28} />
        <Group gap={5} visibleFrom='xs'>
          {items}
        </Group>

        <Group visibleFrom='sm'>
          <Container className={classes.mainSection} size='md'>
            {user && (
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
                          {user?.firstName.charAt(0).toUpperCase() +
                            user?.firstName.slice(1).toLowerCase()}
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
                        <IconUserCircle
                          style={{ width: rem(16), height: rem(16) }}
                          stroke={1.5}
                        />
                      }
                      onClick={handleProfileRedirect}
                    >
                      User Settings
                    </Menu.Item>
                    <Menu.Item
                      leftSection={
                        <IconLogout
                          style={{ width: rem(16), height: rem(16) }}
                          stroke={1.5}
                        />
                      }
                      onClick={handleLogout}
                    >
                      Logout
                    </Menu.Item>

                    <Menu.Divider />
                  </Menu.Dropdown>
                </Menu>
              </Group>
            )}
          </Container>
          {!user && (
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
