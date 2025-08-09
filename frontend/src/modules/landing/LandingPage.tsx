import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'

const Page = styled.main`
  display: flex;
  flex-direction: column;
  gap: 36px;
  padding: 32px 24px;
  max-width: 1100px;
  margin: 0 auto;
  @media (min-width: 768px) {
    padding: 48px 24px;
    gap: 48px;
  }
`

const Hero = styled.section`
  display: grid;
  grid-template-columns: 1fr;
  gap: 18px;
  text-align: center;
  @media (min-width: 900px) {
    grid-template-columns: 1.2fr 0.8fr;
    text-align: left;
    align-items: center;
  }
`

const Title = styled.h2`
  margin: 0;
  font-size: 28px;
  line-height: 1.2;
  color: ${p => p.theme.colors.text};
  @media (min-width: 768px) { font-size: 36px; }
`

const Subtitle = styled.p`
  margin: 0;
  color: ${p => p.theme.colors.muted};
  font-size: 16px;
  @media (min-width: 768px) { font-size: 18px; }
`

const Ctas = styled.div`
  display: flex; gap: 12px; margin-top: 16px; justify-content: center;
  @media (min-width: 900px) { justify-content: flex-start; }
`

const Cta = styled.button`
  background: ${p => p.theme.colors.primary};
  color: #111;
  border: none;
  border-radius: ${p => p.theme.radius.md};
  padding: 10px 14px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: ${p => p.theme.shadow.sm};
`

const Secondary = styled.button`
  background: transparent;
  color: ${p => p.theme.colors.text};
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: ${p => p.theme.radius.md};
  padding: 10px 14px;
  cursor: pointer;
`

const Art = styled.div`
  width: 100%; border-radius: 16px;
  background: radial-gradient(1200px 300px at 10% -20%, rgba(76,125,240,0.35), transparent 60%),
              radial-gradient(800px 300px at 100% 0%, rgba(240,180,41,0.25), transparent 60%),
              linear-gradient(145deg, rgba(255,255,255,0.06), rgba(0,0,0,0.15));
  border: 1px solid rgba(255,255,255,0.08);
  box-shadow: ${p => p.theme.shadow.md};
  display: grid; place-items: center; overflow: hidden;
  /* Let content dictate height. Add min-heights for visual balance */
  min-height: 180px;
  @media (min-width: 900px) { min-height: 280px; }
`

const LogoImg = styled.img`
  display: block;
  max-width: 100%;
  height: auto;
  object-fit: contain;
  filter: drop-shadow(0 8px 24px rgba(0,0,0,0.35));
`

const Carousel = styled.section`
  position: relative;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: ${p => p.theme.radius.lg};
  background: ${p => p.theme.colors.surface};
  box-shadow: ${p => p.theme.shadow.md};
  padding: 18px;
  overflow: hidden;
`

const Slides = styled.div<{index: number}>`
  display: grid; grid-auto-flow: column; grid-auto-columns: 100%;
  transform: translateX(${p => `-${p.index * 100}%`});
  transition: transform 400ms ease;
`

const Slide = styled.div`
  display: grid; gap: 14px; align-content: center; justify-items: center; min-height: 180px;
  text-align: center; padding: 12px;
`

const SlideTitle = styled.h3`
  margin: 0; font-size: 18px; color: ${p => p.theme.colors.text};
`

const SlideText = styled.p`
  margin: 0; font-size: 14px; color: ${p => p.theme.colors.muted}; max-width: 620px;
`

const Nav = styled.div`
  position: absolute; inset: auto 0 8px 0; display: flex; gap: 8px; justify-content: center;
`

const Dot = styled.button<{active: boolean}>`
  width: 9px; height: 9px; border-radius: 50%; border: none; cursor: pointer;
  background: ${p => p.active ? p.theme.colors.primary : 'rgba(255,255,255,0.25)'};
`

const IconWrap = styled.div`
  width: 44px; height: 44px; border-radius: 12px; display: grid; place-items: center;
  background: linear-gradient(145deg, rgba(255,255,255,0.08), rgba(0,0,0,0.15));
  border: 1px solid rgba(255,255,255,0.08);
`

type Feature = { title: string; text: string; icon: React.ReactNode }

export const LandingPage: React.FC = () => {
  const navigate = useNavigate()
  const features = useMemo<Feature[]>(() => [
    {
      title: 'Browse and search books',
      text: 'Lightning-fast catalog with full-text search and clean pagination to find your next read.',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 4a6 6 0 1 1 0 12 6 6 0 0 1 0-12Zm8.32 12.9 3.39 3.4-1.41 1.4-3.4-3.39A8.96 8.96 0 0 1 10 20a9 9 0 1 1 0-18 9 9 0 0 1 8.32 14.9Z" fill="currentColor"/>
        </svg>
      )
    },
    {
      title: 'Simple borrowing flow',
      text: 'Members borrow available copies with clear due dates and cannot double-borrow the same title.',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 2h9a3 3 0 0 1 3 3v14.5a.5.5 0 0 1-.77.42L12 17l-5.23 2.92A.5.5 0 0 1 6 19.5V2Zm2 2v12.38l4-2.23 4 2.23V5a1 1 0 0 0-1-1H8Z" fill="currentColor"/>
        </svg>
      )
    },
    {
      title: 'Librarian tools',
      text: 'Curate the catalog, track circulation, and manage returns with role-based access.',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 5h18v2H3V5Zm0 6h18v2H3v-2Zm0 6h18v2H3v-2Z" fill="currentColor"/>
        </svg>
      )
    }
  ], [])

  const [index, setIndex] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setIndex(i => (i + 1) % features.length), 4500)
    return () => clearInterval(id)
  }, [features.length])

  return (
    <Page>
      <Hero>
        <div>
          <Title>Manage your library with ease</Title>
          <Subtitle>Alexandria brings a delightful experience for members and a powerful toolset for librarians.</Subtitle>
          <Ctas>
            <Cta onClick={() => navigate('/login')}>Log in</Cta>
            <Secondary onClick={() => navigate('/signup')}>Create account</Secondary>
          </Ctas>
        </div>
        <Art>
          <LogoImg src="/alexandria.png" alt="Alexandria" />
        </Art>
      </Hero>

      <Carousel aria-roledescription="carousel">
        <Slides index={index}>
          {features.map((f, i) => (
            <Slide key={i} role="group" aria-roledescription="slide" aria-label={`${i+1} of ${features.length}`}>
              <IconWrap>{f.icon}</IconWrap>
              <SlideTitle>{f.title}</SlideTitle>
              <SlideText>{f.text}</SlideText>
            </Slide>
          ))}
        </Slides>
        <Nav>
          {features.map((_, i) => (
            <Dot key={i} active={i===index} aria-label={`Go to slide ${i+1}`} onClick={() => setIndex(i)} />
          ))}
        </Nav>
      </Carousel>
    </Page>
  )
}

