describe('Popup Component Test', () => {
  beforeEach(() => {
    // Log in before each test
    cy.visit('http://localhost:3000/login'); // Replace with your login page URL
    cy.get('input[name="email"]').type('test@example.com'); // Use a test account
    cy.get('input[name="password"]').type('Password@123');
    cy.get('button[type="submit"]').click();

    // Ensure login was successful
    cy.url().should('include', '/'); // Replace with your dashboard route
  });

  it('should create a habit, test the popup after clicking edit, and delete the habit', () => {
    // Create a new habit
    cy.contains('Add New Habit').click();
    cy.get('input[type="text"]').eq(0).type('Popup Test Habit'); // Title field
    cy.get('input[type="text"]').eq(1).type('This habit is for testing the popup'); // Description field
    cy.get('select').select('daily'); // Frequency dropdown
    cy.get('button').contains('Add Habit').click();

    // Assert that the habit is created
    cy.contains('Popup Test Habit').should('be.visible');
    cy.contains('This habit is for testing the popup').should('be.visible');

    // Hover over the menu button and click "Edit"
    cy.contains('Popup Test Habit')
      .parents('.habit-card') // Adjust to the correct parent class
      .find('.menu-btn') // Replace with the actual selector for the menu button
      .realHover(); // Use realHover to simulate a real hover event

    cy.contains('Popup Test Habit')
      .parents('.habit-card') // Adjust to the correct parent class
      .find('.dropdown-content a') // Adjust to the correct selector for the edit option
      .contains('Edit') // Ensure it matches the text of the edit option
      .click();

    // Assert that the popup is visible
    cy.get('.popup').should('be.visible');

    // Click the "Cancel" button and assert that the popup is closed
    cy.get('.popup .cancel').click();
    cy.get('.popup').should('not.exist');

    // Delete the habit
    cy.contains('Popup Test Habit')
      .parents('.habit-card') // Adjust to the correct parent class
      .find('.menu-btn') // Find the three dots menu button
      .realHover(); // Use realHover to simulate a real hover event

    cy.contains('Popup Test Habit')
      .parents('.habit-card') // Adjust to the correct parent class
      .find('.dropdown-content a') // Adjust to the correct selector for the delete option
      .contains('Delete') // Ensure it matches the text of the delete option
      .click();

    // Assert that the habit is no longer displayed on the page
    cy.contains('Popup Test Habit').should('not.exist');
  });
});