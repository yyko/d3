const NOTE_FIELDS = {
  name: 'notes',//sql table name
  ids: ['id', 'tags', 'text', 'moment_created', 'moment_edited', 'goal_id'],
  byId: {
    id: 'varchar(40) NOT NULL',
    tags : 'varchar(1000)',
    text: 'text NOT NULL',
    moment_created:'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
    moment_edited: 'TIMESTAMP',
    goal_id: 'text'
  },
}