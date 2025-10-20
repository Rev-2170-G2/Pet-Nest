describe('Guest User Actions', () => {
  before(() => {
    cy.visit('http://localhost:5173/');
    cy.contains('PetNest');
  });

  it('should allow a guest user to view pets and events', () => {
    cy.contains('Pets Please');
    cy.contains('Filter by Type');
    cy.contains('Event Hunting');
  });

  it('should not allow a guest user to create pets, and prompt them to log in instead', () => {
    cy.contains('Got a talented pet or an event?');
    cy.contains('Post A Pet').click();
    cy.contains('You must be logged in to perform this action.')
    cy.get('button.close-btn').click();
  });

  it('should not allow a guest user to create events, and prompt them to log in instead', () => {
    cy.contains('Got a talented pet or an event?');
    cy.contains('Create An Event').click();
    cy.contains('You must be logged in to perform this action.')
    cy.get('button.close-btn').click();
  });

  it('should allow a guest user to register and log in', () => {
    cy.get('button.nav-btn.register-btn').click();
    cy.get('input#username').type('BobbyS');
    cy.get('input#email').type('bobs@email.com');
    cy.get('input#password').type('bobspass');
    cy.get('button[type="submit"]').click();
    cy.contains('Registration successful');
    cy.contains('Registration successful').should('not.exist');
    cy.get('input#username').type('BobbyS');
    cy.get('input#password').type('bobspass');
    cy.get('button[type="submit"]').click();
    cy.contains('Hello, BobbyS');
  });

  after(() => {
    cy.get('button#logout-btn').click();
    cy.contains('Login');
  });
});

describe('Logged In User Actions', () => {
  before(() => {
    cy.visit('http://localhost:5173/');
    cy.contains('PetNest');
    cy.contains('Pets Please');
    cy.contains('Event Hunting');
    cy.get('button.nav-btn.login-btn').click();
    cy.get('input#username').type('BobbyS');
    cy.get('input#password').type('bobspass');
    cy.get('button[type="submit"]').click();
    cy.contains('Logout');
  });

  it('should allow a logged in user to create a pet', () => {
    cy.get('#join').click();
    cy.contains('Post A Pet').click();
    cy.get('input#formBasicName').type('Fluffy');
    cy.get('select#formBasicType').select('Dog');
    cy.get('textarea#formBasicDesc').type('Fluffiest dog every, can dance too');
    cy.get('input[placeholder="Share a photo link and press enter"]')
      .type('https://images.unsplash.com/photo-1581753418434-51c11169a3c1{enter}');
    cy.get('input[placeholder="Search for a place"]').type('Boston');
    cy.contains('Boston, MA, USA').click({timeout: 10000});
    cy.get('input[placeholder="Type a value and press Enter"]').type('dancing');
    cy.get('input[placeholder="Enter a dollar amount"]').clear().type('20{enter}');
    cy.contains('Submit').click({timeout: 10000});
    cy.contains('Fluffy');
  });

  it('should allow a logged in user to edit a pet', () => {
    cy.contains('Profile').click();
    cy.contains('Your Profile');
    cy.contains('My Offers').click();
    cy.contains('My Pets').click();
    cy.contains('Fluffy')
      .closest('.profile-card')
      .within(() => {
        cy.contains('View Details').click();
      });
    cy.contains('Edit').click();
    cy.get('input[placeholder="Type a value and press Enter"]').type('parkour');
    cy.get('input[placeholder="Enter a dollar amount"]').clear().type('25{enter}');
    cy.contains('Submit').click({ timeout: 10000 });
    cy.contains('Profile').click();
    cy.contains('Your Profile');
    cy.contains('My Offers').click();
    cy.contains('My Pets').click();
    cy.contains('Fluffy')
      .closest('.profile-card')
      .within(() => {
        cy.contains('View Details').click();
      });
    cy.contains('parkour')
  });

  it('should allow a logged in user to delete a pet', () => {
    cy.contains('Profile').click();
    cy.contains('Your Profile');
    cy.contains('My Offers').click();
    cy.contains('My Pets').click();
    cy.contains('Fluffy')
      .closest('.profile-card')
      .within(() => {
        cy.contains('Delete').click();
        cy.contains('Confirm').click();
      })
    cy.contains('Fluffy').should('not.exist');
  });

  it('should allow a logged in user to create an event', () => {
    cy.contains('My Pets').click();
    cy.contains('My Events').click();
    cy.contains('Add Event').click();
    cy.contains('Create Event')
    cy.get('input#formBasicName').type('Dancing Dogs Show');
    cy.get('textarea#formBasicDesc').type('Dog show to showcase your dancing dogs. Fun community event.');
    cy.get('input[placeholder="Share a photo link and press enter"]')
      .type('https://images.unsplash.com/photo-1581753418434-51c11169a3c1{enter}');
    cy.get('input[placeholder="Search for a place"]').type('Boston');
    cy.contains('Boston, MA, USA').click();
    cy.contains('Submit').click({ timeout: 10000 });
    cy.contains('Profile').click();
    cy.contains('My Offers').click();
    cy.contains('My Events').click();
    cy.contains('Dancing Dogs Show');
  });

  it('should allow a logged in user to edit an event', () => {
    cy.contains('Dancing Dogs Show')
      .closest('.profile-card')
      .within(() => {
        cy.contains('View Details').click();
      });
    cy.contains('Edit').click();
    cy.get('textarea#formBasicDesc').clear().type('Dog show to showcase your dancing dogs. Fun community event. URGENT');
    cy.contains('Submit').click({timeout: 10000});
    cy.contains('Profile').click();
    cy.contains('Your Profile');
    cy.contains('My Offers').click();
    cy.contains('My Events').click();
    cy.contains('Dancing Dogs Show')
      .closest('.profile-card')
      .within(() => {
        cy.contains('View Details').click();
      });
    cy.contains('URGENT');
  });

  it('should allow a logged in user to delete an event', () => {
    cy.contains('Profile').click();
    cy.contains('Your Profile');
    cy.contains('My Offers').click();
    cy.contains('My Events').click();
    cy.contains('Dancing Dogs Show')
      .closest('.profile-card')
      .within(() => {
        cy.contains('Delete').click();
        cy.contains('Confirm').click();
      })
    cy.contains('Dancing Dogs Show').should('not.exist');
  });

  after(() => {
    cy.get('button#logout-btn').click();
    cy.contains('Login');
  });
});