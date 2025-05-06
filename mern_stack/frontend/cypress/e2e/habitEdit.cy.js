describe('Habit Edit System Test', () => {
  beforeEach(() => {
    // Log in before each test
    cy.visit('http://localhost:3000/login'); // Replace with your login page URL
    cy.get('input[name="email"]').type('test@example.com'); // Use a test account
    cy.get('input[name="password"]').type('Password@123');
    cy.get('button[type="submit"]').click();

    // Ensure login was successful
    cy.url().should('include', '/'); // Replace with your dashboard route

    // Ensure a habit exists before testing editing
    cy.contains('Add New Habit').click();
    cy.get('input[type="text"]').eq(0).type('Edit Me'); // Title field
    cy.get('input[type="text"]').eq(1).type('This habit will be edited'); // Description field
    cy.get('select').select('daily'); // Frequency dropdown
    cy.get('button').contains('Add Habit').click();
    cy.contains('Edit Me').should('be.visible'); // Ensure the habit is created
  });

  it('should edit a habit successfully', () => {
    // Hover over the three dots menu button
    cy.contains('Edit Me')
      .parents('.habit-card') // Adjust to the correct parent class
      .find('.menu-btn') // Find the three dots menu button
      .realHover(); // Use realHover to simulate a real hover event

    // Click the edit button inside the dropdown
    cy.contains('Edit Me')
      .parents('.habit-card') // Adjust to the correct parent class
      .find('.dropdown-content a') // Adjust to the correct selector for the edit option
      .contains('Edit') // Ensure it matches the text of the edit option
      .click();

    // Update the habit details
    cy.get('input[type="text"]').eq(0).clear().type('Edited Habit'); // Update title
    cy.get('input[type="text"]').eq(1).clear().type('This habit has been edited'); // Update description
    cy.get('button').contains('confirm').click(); // Submit the changes

    // Assert that the habit is updated on the page
    cy.contains('Edited Habit').should('be.visible');
    cy.contains('This habit has been edited').should('be.visible');

    // Delete the newly edited habit
    cy.contains('Edited Habit')
      .parents('.habit-card') // Adjust to the correct parent class
      .find('.menu-btn') // Find the three dots menu button
      .realHover(); // Hover over the three dots menu button again

    cy.contains('Edited Habit')
      .parents('.habit-card') // Adjust to the correct parent class
      .find('.dropdown-content a') // Adjust to the correct selector for the delete option
      .contains('Delete') // Ensure it matches the text of the delete option
      .click();

    // Assert that the habit is no longer displayed on the page
    cy.contains('Edited Habit').should('not.exist');
  });
});