class User {
    public id!: string; //au format uuidv4
    public username!: string; // cette propriété doit porter une contrainte d'unicité
    public email!: string; // cette propriété doit porter une contrainte d'unicité
    public password!: string;
    public role!: 'Employee' | 'Admin' | 'ProjectManager' // valeur par defaut : 'Employee'
}