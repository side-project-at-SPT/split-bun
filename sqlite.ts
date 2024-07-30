import { Database } from "bun:sqlite";
export const db = new Database();
db.query(
  "create table if not exists users (id integer primary key, name text, token text, nickname text, is_login integer default 0);"
).run();
db.query(
  "insert into users (name, token, nickname) values ('admin', '123456', 'admin');"
).run();

const updateUser = ({
  name,
  token,
  nickname,
  is_login,
}: {
  name?: string;
  token?: string;
  nickname?: string;
  is_login?: number;
}) => {
  const commands = [];
  if (name) commands.push(`name = '${name}'`);
  if (token) commands.push(`token = '${token}'`);
  if (nickname) commands.push(`nickname = '${nickname}'`);
  if (is_login) commands.push(`is_login = ${is_login}`);

  db.query(`update users set ${commands.join(", ")};`).run();
};

const getUser = (): {
  id: number;
  name: string;
  token: string;
  nickname: string;
  is_login: boolean;
} => {
  const user = db.query(`select * from users limit 1;`).get() as any;
  return {
    id: user.id,
    name: user.name,
    token: user.token,
    nickname: user.nickname,
    is_login: Boolean(user.is_login),
  };
};

export { getUser, updateUser };
