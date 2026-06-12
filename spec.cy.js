// Ignore unexpected browser exceptions
Cypress.on('uncaught:exception', (err, runnable) => {
  return false
})

describe('HelpDesk Ticketing System UI Testing', () => {

  beforeEach(() => {
    // Loads our local HelpDesk HTML UI file natively using relative path
    cy.readFile('src/main/resources/static/index.html').then((html) => {
      cy.document().invoke('write', html)
    })

    // Ensure the login page fields are visible before running each test
    cy.get('input[name="username"]').should('be.visible')
  })

  // TEST CASE 1: Valid Login
  it('Valid Login', () => {
    cy.get('input[name="username"]').type('Admin')
    cy.get('input[name="password"]').type('admin123')
    cy.get('#loginBtn').click()

    // Verifies that the app successfully switched views to dashboard
    cy.url().should('include', '/dashboard')
    cy.contains('HelpDesk Dashboard').should('be.visible')
  })

  // TEST CASE 2: Invalid Login
  it('Invalid Login', () => {
    cy.get('input[name="username"]').type('WrongUser')
    cy.get('input[name="password"]').type('WrongPass')
    cy.get('#loginBtn').click()

    // Asserts that the validation error triggers
    cy.contains('Invalid credentials', { timeout: 10000 }).should('be.visible')
  })

  // TEST CASE 3: User Action: Submit Ticket in Dashboard
  it('User Action Submit Ticket', () => {
    // Login first
    cy.get('input[name="username"]').type('Admin')
    cy.get('input[name="password"]').type('admin123')
    cy.get('#loginBtn').click()
    cy.url().should('include', '/dashboard')

    // Fill up and submit a HelpDesk Ticket concern
    cy.get('#concern').type('Cannot login to email account')
    cy.get('#submitBtn').click()

    // Assert that the ticket box successfully renders the submitted data
    cy.get('#ticketResult').should('be.visible')
    cy.contains('Ticket Created Successfully!').should('exist')
    cy.get('#ticketIssue').should('contain', 'Cannot login to email account')
  })

  // TEST CASE 4: Logout
  it('Logout', () => {
    // Login first
    cy.get('input[name="username"]').type('Admin')
    cy.get('input[name="password"]').type('admin123')
    cy.get('#loginBtn').click()
    cy.url().should('include', '/dashboard')

    // Trigger logout sequence
    cy.get('#logoutBtn').click()

    // Assert that the view securely shifts back to the Auth/Login portal layout
    cy.url().should('include', '/auth/login')
    cy.get('#main-heading').should('contain', 'HelpDesk Login')
  })
})
