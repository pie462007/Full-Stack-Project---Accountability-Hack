describe('Leaderboard Page Test', () => {
  beforeEach(() => {
    // Log in before each test
    cy.visit('http://localhost:3000/login'); // Replace with your login page URL
    cy.get('input[name="email"]').type('test@example.com'); // Use a test account
    cy.get('input[name="password"]').type('Password@123');
    cy.get('button[type="submit"]').click();

    // Ensure login was successful
    cy.url().should('include', '/'); // Replace with your dashboard route
  });

  it('should navigate to the leaderboard page and verify its content', () => {
    // Navigate to the leaderboard page
    cy.contains('leaderboard').click(); // Replace with the actual text or selector for the leaderboard page link

    // Assert that the leaderboard page is loaded
    cy.url().should('include', '/leaderboard'); // Replace with your leaderboard page route
    cy.contains('Leaderboard').should('be.visible'); // Replace with a unique element on the leaderboard page

    // Verify leaderboard content (example: check for a user in the leaderboard)
    cy.get('.profile') // Replace with the actual selector for leaderboard entries
      .should('have.length.greaterThan', 0); // Ensure there are entries in the leaderboard
  });
});