describe('Habit Deletion System Test', () => {
  beforeEach(() => {
    // Log in before each test
    cy.visit('http://localhost:3000/login'); // Replace with your login page URL
    cy.get('input[name="email"]').type('test@example.com'); // Use a test account
    cy.get('input[name="password"]').type('Password@123');
    cy.get('button[type="submit"]').click();

    // Ensure login was successful
    cy.url().should('include', '/'); // Replace with your dashboard route

    // Ensure a habit exists before testing deletion
    cy.contains('Add New Habit').click();
    cy.get('input[type="text"]').eq(0).type('Delete Me'); // Title field
    cy.get('input[type="text"]').eq(1).type('This habit will be deleted'); // Description field
    cy.get('select').select('daily'); // Frequency dropdown
    cy.get('button').contains('Add Habit').click();
    cy.contains('Delete Me').should('be.visible'); // Ensure the habit is created
  });

  it('should delete a habit successfully', () => {
    // Hover over the three dots menu button
    cy.contains('Delete Me')
      .parents('.habit-card') // Adjust to the correct parent class
      .find('.menu-btn') // Find the three dots menu button
      .realHover(); // Use realHover to simulate a real hover event
  
    // Click the delete button inside the dropdown
    cy.contains('Delete Me')
      .parents('.habit-card') // Adjust to the correct parent class
      .find('.delete-option') // Find the delete button inside the dropdown
      .should('be.visible') // Ensure the delete button is visible
      .click();
  
    // Assert that the habit is no longer displayed on the page
    cy.contains('Delete Me').should('not.exist');
  });
});