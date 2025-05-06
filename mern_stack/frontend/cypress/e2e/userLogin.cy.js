describe('User Login System Test', () => {
  it('should log in a user successfully', () => {
      cy.visit('http://localhost:3000/login'); // Replace with your frontend URL
      
      cy.get('body').should('contain', 'Login'); // Replace 'Login' with a unique text or element on the page

      // Fill in login form
      cy.get('input[name="email"]', { timeout: 10000 }).type('test@example.com'); // Increase timeout
      cy.get('input[name="password"]').type('Password@123');
      cy.get('button[type="submit"]').click();

      // Assert successful login
      cy.url().should('include', '/'); // Replace with your dashboard route
      cy.get('body').should('contain', 'test@example.com'); //looks for username at the top right of the page
  });

  it('should show an error for invalid credentials', () => {
      cy.visit('http://localhost:3000/login');

      // Fill in login form with invalid credentials
      cy.get('input[name="email"]').type('wrong@example.com');
      cy.get('input[name="password"]').type('wrongpassword');
      cy.get('button[type="submit"]').click();

      // Assert error message
      cy.contains('Incorrect email').should('be.visible');
  });
});