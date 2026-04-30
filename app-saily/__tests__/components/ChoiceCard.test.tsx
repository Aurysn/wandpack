import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import ChoiceCard from '@/components/quiz/ChoiceCard'

describe('ChoiceCard', () => {
  it('renders the label', () => {
    render(<ChoiceCard emoji="🏖️" label="Beach" selected={false} onClick={jest.fn()} />)
    expect(screen.getByText('Beach')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const onClick = jest.fn()
    render(<ChoiceCard emoji="🏖️" label="Beach" selected={false} onClick={onClick} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('applies selected styles when selected is true', () => {
    const { container } = render(
      <ChoiceCard emoji="🏖️" label="Beach" selected={true} onClick={jest.fn()} />
    )
    expect(container.firstChild).toHaveClass('border-indigo-600')
  })
})
