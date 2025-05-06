describe('Habit Completion System Test', () => {
  beforeEach(() => {
    // Log in before each test
    cy.visit('http://localhost:3000/login'); // Replace with your login page URL
    cy.get('input[name="email"]').type('test@example.com'); // Use a test account
    cy.get('input[name="password"]').type('Password@123');
    cy.get('button[type="submit"]').click();

    // Ensure login was successful
    cy.url().should('include', '/'); // Replace with your dashboard route

    // Ensure a habit exists before testing completion
    cy.contains('Add New Habit').click();
    cy.get('input[type="text"]').eq(0).type('Complete Me'); // Title field
    cy.get('input[type="text"]').eq(1).type('This habit will be marked complete'); // Description field
    cy.get('select').select('daily'); // Frequency dropdown
    cy.get('button').contains('Add Habit').click();
    cy.contains('Complete Me').should('be.visible'); // Ensure the habit is created
  });

  it('should mark a habit as complete successfully', () => {
    // Locate the "Mark as Complete" button
    cy.contains('Complete Me')
      .parents('.habit-card') // Adjust to the correct parent class
      .find('button') // Find the button inside the habit card
      .contains('Mark as Complete') // Ensure it matches the button text
      .click();

    // Assert that the habit is marked as complete
    cy.contains('Complete Me')
      .parents('.habit-card') // Adjust to the correct parent class
      .should('have.class', 'completed'); // Check for a class or visual indicator

    // Assert that the streak is updated
    cy.contains('Complete Me')
      .parents('.habit-card') // Adjust to the correct parent class
      .find('.streak-text') // Find the streak text
      .should('contain', 'Streak: 1'); // Ensure the streak is incremented
    
    // Delete the habit
    cy.contains('Complete Me')
      .parents('.habit-card') // Adjust to the correct parent class
      .find('.menu-btn') // Find the three dots menu button
      .realHover(); // Use realHover to simulate a real hover event

    cy.contains('Complete Me')
      .parents('.habit-card') // Adjust to the correct parent class
      .find('.dropdown-content a') // Adjust to the correct selector for the delete option
      .contains('Delete') // Ensure it matches the text of the delete option
      .click();

    // Assert that the habit is no longer displayed on the page
    cy.contains('Complete Me').should('not.exist');
  });
});