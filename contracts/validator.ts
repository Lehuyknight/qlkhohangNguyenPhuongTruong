declare module '@ioc:Adonis/Core/Validator' {
    interface Rules {
       checkPassword(): Rule,
       checkCustomer(): Rule,
       checkProduct(): Rule
    }
  }