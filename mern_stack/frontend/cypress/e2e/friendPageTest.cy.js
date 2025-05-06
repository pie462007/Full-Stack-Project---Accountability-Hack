describe('Friends Page Test', () => {
  beforeEach(() => {
    // Log in before each test
    cy.visit('http://localhost:3000/login'); // Replace with your login page URL
    cy.get('input[name="email"]').type('test@example.com'); // Use a test account
    cy.get('input[name="password"]').type('Password@123');
    cy.get('button[type="submit"]').click();

    // Ensure login was successful
    cy.url().should('include', '/'); // Replace with your dashboard route
  });

  it('should navigate to the friends page and search for a friend', () => {
    // Navigate to the friends page
    cy.contains('friends').click(); // Replace with the actual text or selector for the friends page link

    // Assert that the friends page is loaded
    cy.url().should('include', '/friends'); // Replace with your friends page route
    cy.contains('Find Friends').should('be.visible'); // Replace with a unique element on the friends page

    // Search for a friend
    cy.get('input[type="text"]').type('petrus@gmail.com'); // Replace with the actual selector for the search input

    // Assert that the friend appears in the search results
    cy.contains('petrus@gmail.com').should('be.visible'); // Replace with the actual text or selector for the friend's name
  });
});