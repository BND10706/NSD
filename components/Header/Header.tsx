'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Container, Group, Burger, Button } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { MantineLogo } from '@mantinex/mantine-logo'
import classes from './Header.module.css'

const links = [
  { link: '/', label: 'Home' },
  { link: '/about', label: 'About' },
]

export function Header() {
  const pathname = usePathname()
  const [opened, { toggle }] = useDisclosure(false)
  const [active, setActive] = useState(links[0].link)

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

  return (
    <header className={classes.header}>
      <Container size='md' className={classes.inner}>
        <MantineLogo size={28} />
        <Group gap={5} visibleFrom='xs'>
          {items}
        </Group>

        <Group visibleFrom='sm'>
          <Link href='/Login'>
            <Button variant={buttonVariant} onClick={() => setActive('/Login')}>
              Log in
            </Button>
          </Link>
        </Group>

        <Burger opened={opened} onClick={toggle} hiddenFrom='xs' size='sm' />
      </Container>
    </header>
  )
}
