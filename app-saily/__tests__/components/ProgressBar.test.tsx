import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import ProgressBar from '@/components/quiz/ProgressBar'

describe('ProgressBar', () => {
  it('renders current step and total', () => {
    render(<ProgressBar currentStep={2} totalSteps={5} />)
    expect(screen.getByText(/step 2 of 5/i)).toBeInTheDocument()
  })

  it('renders filled segments for completed steps', () => {
    const { container } = render(<ProgressBar currentStep={3} totalSteps={5} />)
    const filled = container.querySelectorAll('[data-filled="true"]')
    expect(filled).toHaveLength(3)
  })
})
