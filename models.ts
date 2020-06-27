import {
  Model,
  DataTypes,
  Relationships,
} from 'https://deno.land/x/denodb/mod.ts'

export class UserModel extends Model {
  static table = 'users'
  static timestamps = true

  static defaults = {
    auth: 'default',
  }

  static fields = {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    auth: {
      type: DataTypes.ENUM,
      values: ['default'],
    },
    pass: {
      type: DataTypes.STRING,
    },
  }

  static bookmarks() {
    return this.hasMany(BookmarkModel)
  }

  id!: string
  name!: string
  email!: string
  auth!: 'default'
  pass!: string
}

export class LinkModel extends Model {
  static table = 'links'
  static timestamps = true

  static fields = {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    url: {
      type: DataTypes.STRING,
      unique: true,
    },
  }

  static bookmarks() {
    return this.hasMany(BookmarkModel)
  }

  id!: string
  url!: string
}

export class BookmarkModel extends Model {
  static table = 'bookmarks'
  static timestamps = true

  static fields = {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    user: Relationships.belongsTo(UserModel),
    link: Relationships.belongsTo(LinkModel),
  }

  static user() {
    return this.hasOne(UserModel)
  }

  static link() {
    return this.hasOne(LinkModel)
  }

  id!: string
  title!: string
  description!: string | null
  user!: UserModel['id']
  link!: LinkModel['id']
}
