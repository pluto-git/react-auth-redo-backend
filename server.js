require("dotenv").config();
const express = require("express");
const ManagementClient = require("auth0").ManagementClient;
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
const authConfig = {
  domain: process.env.AUTH0_DOMAIN,
  audience: process.env.AUTH0_AUDIENCE,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
};

const auth0 = new ManagementClient({
  domain: authConfig.domain,
  clientId: authConfig.clientId,
  clientSecret: authConfig.clientSecret,
});

app.get("/api/users", (req, res) => {
  auth0.getUsers((err, users) => {
    res.json(users);
  });
});

app.patch("/api/users", (req, res) => {
  const { selectedUsers, blockedStatus } = req.body;
  console.log(blockedStatus);
  console.log(selectedUsers);
  selectedUsers.forEach((user_id) => {
    auth0.users.update({ id: user_id }, { blocked: blockedStatus }, (err, user) => {
      if (err) {
        res.json({ error: err });
      }
      console.log(user);
    });
  });

  res.status(200).json({ status: "Successfully updated the selected users" });
});

app.delete("/api/users", (req, res) => {
  const selectedUsers = req.body.selectedUsers;
  selectedUsers.forEach((user_id) => {
    auth0.deleteUser({ id: user_id }, (err) => {
      if (err) {
        res.json({ error: err });
      }
    });
  });
  res.status(200).json({ status: "Successfully deleted selected users" });
});

app.listen(PORT, () => {
  console.log(`Your server is running on PORT ${PORT}`);
});
