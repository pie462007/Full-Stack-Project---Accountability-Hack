describe('Signup Page Test', () => {
  it('should navigate to the signup page and create a new account', () => {
    // Visit the signup page
    cy.visit('http://localhost:3000/signup'); // Replace with your signup page URL

    // Fill out the signup form
    cy.get('input[name="email"]').type('newuser@example.com'); // Replace with the actual selector for the email field
    cy.get('input[name="password"]').type('Password@123'); // Replace with the actual selector for the password field
    cy.get('button[type="submit"]').click(); // Replace with the actual selector for the signup button

    // Assert that the signup was successful
    cy.url().should('include', '/'); // Replace with your dashboard route after signup
    cy.contains('newuser@example.com').should('be.visible'); // Replace with a unique element on the dashboard

    // Sign out
    cy.get('button').contains('Log out').click(); // Replace with your logout button selector
    cy.url().should('include', '/login'); // Ensure the user is redirected to the login page

    // Try signing up with the same email again
    cy.visit('http://localhost:3000/signup'); // Navigate back to the signup page
    cy.get('input[name="email"]').type('newuser@example.com');
    cy.get('input[name="password"]').type('Password@123');
    cy.get('button[type="submit"]').click();

    // Assert that an error message is displayed
    cy.contains('email already in use').should('be.visible'); // Replace with the actual error message displayed by your app
  });
});