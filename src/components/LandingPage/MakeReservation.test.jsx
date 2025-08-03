/*
  MakeReservation.test.jsx
  Goal - Test the MakeReservation component

  Some testing ideas
    Handles multiple rapid clicks on party size buttons
    Calendar closes when clicking outside (if implemented)
*/

import '@testing-library/jest-dom/vitest'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MakeReservation from './MakeReservation'

// Mock the date object
vi.mock('date-fns', () => ({
  format: vi.fn((date, formatStr) => date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric"
  }))
}))

describe('MakeReservation', () => {

    afterEach(() => {
        cleanup()
    })

  it('renders the reservation form', () => {
    render(<MakeReservation />)
    
    // Check if the main heading is displayed
    expect(screen.getByText('Make a Reservation')).toBeInTheDocument()
    
    // Check if form elements are present
    expect(screen.getByText('Party size')).toBeInTheDocument()
    expect(screen.getByText('Date')).toBeInTheDocument()
    expect(screen.getByText('Time')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument()
  })

  it('shows calendar when date button is clicked', async () => {
    const user = userEvent.setup()
    render(<MakeReservation />)
    
    // Check how many elements with this test ID exist
    const allDateButtons = screen.getAllByTestId('date-button')
    console.log('Number of date buttons found:', allDateButtons.length)
    
    // Use the first one
    const dateButton = allDateButtons[0]
    await user.click(dateButton)
    
    
    // Check that calendar appears with day headers
    expect(screen.getByText('Sun')).toBeInTheDocument()
    expect(screen.getByText('Mon')).toBeInTheDocument()
    expect(screen.getByText('Tue')).toBeInTheDocument()
    expect(screen.getByText('Wed')).toBeInTheDocument()
    expect(screen.getByText('Thu')).toBeInTheDocument()
    expect(screen.getByText('Fri')).toBeInTheDocument()
    expect(screen.getByText('Sat')).toBeInTheDocument()
  })

  it('shows validation error when no date is selected', async () => {
    const user = userEvent.setup()
    render(<MakeReservation />)

    const submitButton = screen.getByRole('button', { name: 'Search' })
    await user.click(submitButton)

    expect(screen.getByText('Please select a date')).toBeInTheDocument()
  })

  it('shows validation error when no time is selected', async () => {
    const user = userEvent.setup()
    render(<MakeReservation />)

    const submitButton = screen.getByRole('button', { name: 'Search' })
    await user.click(submitButton)

    expect(screen.getByText('Please select a time')).toBeInTheDocument()
  })

  it('clears date error when date is selected', async () => {
    const user = userEvent.setup()
    render(<MakeReservation />)

    // First submit to show error
    const submitButton = screen.getByRole('button', { name: 'Search' })
    await user.click(submitButton)
    expect(screen.getByText('Please select a date')).toBeInTheDocument()

    // Select a date
    const dateButton = screen.getByText('Select a date')
    await user.click(dateButton)
    
    // selecting today may have different timezone, so won't work, test tomorrow
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1) 
    const tomorrowButton = screen.getByText(tomorrow.getDate().toString())
    await user.click(tomorrowButton)
    expect(screen.queryByText('Please select a date')).not.toBeInTheDocument()

  })
})