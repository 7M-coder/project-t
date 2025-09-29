import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ProtectedRoute from '../components/ProtectedRoute'

describe('ProtectedRoute', () => {
  const DummyComponent = () => <div data-testid="protected-content">Protected Content</div>

  afterEach(() => {
    localStorage.clear()
  })

  test('renders children when ACCESS_TOKEN exists', () => {
    localStorage.setItem('ACCESS_TOKEN', 'dummy-token')
    render(
      <MemoryRouter>
        <ProtectedRoute>
          <DummyComponent />
        </ProtectedRoute>
      </MemoryRouter>
    )

    expect(screen.getByTestId('protected-content')).toBeInTheDocument()
  })

  test('redirects to login when ACCESS_TOKEN does not exist', () => {
    // Ensure token is not present
    localStorage.removeItem('ACCESS_TOKEN')
    render(
      <MemoryRouter initialEntries={['/protected']}>
        <ProtectedRoute>
          <DummyComponent />
        </ProtectedRoute>
      </MemoryRouter>
    )

    // Because the Navigate component does not render any visible content,
    // we expect the dummy content not to be in the document.
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
  })
})
