describe('Habit Creation System Test', () => {
  beforeEach(() => {
    // Log in before each test
    cy.visit('http://localhost:3000/login'); // Replace with your login page URL
    cy.get('input[name="email"]').type('test@example.com'); // Use a test account
    cy.get('input[name="password"]').type('Password@123');
    cy.get('button[type="submit"]').click();

    // Ensure login was successful
    cy.url().should('include', '/'); // Replace with your dashboard route
  });

  it('should create a new habit successfully', () => {
    // Navigate to the habit creation form
    cy.contains('Add New Habit').click(); // Adjust if the button text is different

    // Fill in the habit creation form
    cy.get('input[type="text"]').eq(0).type('Exercise Daily'); // Title field
    cy.get('input[type="text"]').eq(1).type('Workout every morning'); // Description field
    cy.get('select').select('daily'); // Frequency dropdown

    // Submit the form
    cy.get('button').contains('Add Habit').click();

    // Assert that the habit is displayed on the page
    cy.contains('Exercise Daily').should('be.visible');
    cy.contains('Workout every morning').should('be.visible');
    cy.contains('Streak: 0').should('be.visible'); // Assuming streak is displayed

    // Delete the newly created habit
    cy.contains('Exercise Daily')
      .parents('.habit-card') // Adjust to the correct parent class
      .find('.menu-btn') // Find the three dots menu button
      .realHover(); // Use realHover to simulate a real hover event

    cy.contains('Exercise Daily')
      .parents('.habit-card') // Adjust to the correct parent class
      .find('.dropdown-content a') // Adjust to the correct selector for the delete option
      .contains('Delete') // Ensure it matches the text of the delete option
      .click();

    // Assert that the habit is no longer displayed on the page
    cy.contains('Exercise Daily').should('not.exist');
    
  });

  it('should show an error if the habit title is empty', () => {
    // Navigate to the habit creation form
    cy.contains('Add New Habit').click();

    // Leave the title field empty and fill in other fields
    cy.get('input[type="text"]').eq(1).type('Workout every morning'); // Description field
    cy.get('select').select('daily'); // Frequency dropdown

    // Submit the form
    cy.get('button').contains('Add Habit').click();

    // Assert that an error message is displayed
    cy.contains('Habit validation failed: title: Path `title` is required.').should('be.visible'); // Adjust based on your validation message
  });
});