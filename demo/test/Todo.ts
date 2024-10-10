const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TodoList test", function () {
  async function deployTodoListFixture() {
    const [owner, otherAccount] = await ethers.getSigners();
    const TodoList = await ethers.getContractFactory("TodoList");
    const todoList = await TodoList.deploy();
    return { todoList, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { todoList, owner } = await loadFixture(deployTodoListFixture);
      expect(await todoList.owner()).to.equal(owner.address);
    });
  });

  describe("Creating a todo", function () {
    it("Should create a new todo", async function () {
      const { todoList, owner } = await loadFixture(deployTodoListFixture);
      await expect(
        todoList.connect(owner).createTodo("Todo title", "Todo Description")
      )
        .to.emit(todoList, "TodoCreated")
        .withArgs("Todo title", 1);

      const todo = await todoList.getTodo(0);
      expect(todo[0]).to.equal("Todo title");
      expect(todo[1]).to.equal("Todo Description");
      expect(todo[2]).to.equal(1);
    });

    it("Should revert if not called by owner", async function () {
      const { todoList, otherAccount } = await loadFixture(
        deployTodoListFixture
      );
      await expect(
        todoList
          .connect(otherAccount)
          .createTodo("Todo title", "Todo Description")
      ).to.be.revertedWith("You're not allowed");
    });
  });

  describe("Updating a todo", function () {
    it("Should update an existing todo", async function () {
      const { todoList, owner } = await loadFixture(deployTodoListFixture);
      await todoList
        .connect(owner)
        .createTodo("Todo title", "Todo Description");

      await expect(
        todoList
          .connect(owner)
          .updateTodo(0, "Updated Todo", "Updated Description")
      )
        .to.emit(todoList, "TodoUpdated")
        .withArgs("Updated Todo", 2);

      const todo = await todoList.getTodo(0);
      expect(todo[0]).to.equal("Updated Todo");
      expect(todo[1]).to.equal("Updated Description");
      expect(todo[2]).to.equal(2);
    });

    it("Should revert if index is out of bounds", async function () {
      const { todoList, owner } = await loadFixture(deployTodoListFixture);
      await expect(
        todoList.connect(owner).updateTodo(0, "Todo title", "Todo Description")
      ).to.be.revertedWith("Index is out-of-bounds");
    });
  });

  describe("Getting todos", function () {
    it("Should return a single todo", async function () {
      const { todoList, owner } = await loadFixture(deployTodoListFixture);
      await todoList.connect(owner).createTodo("To eat", "To eat tonight");

      const todo = await todoList.getTodo(0);
      expect(todo[0]).to.equal("To eat");
      expect(todo[1]).to.equal("To eat tonight");
      expect(todo[2]).to.equal(1);
    });

    it("Should return all todos", async function () {
      const { todoList, owner } = await loadFixture(deployTodoListFixture);
      await todoList.connect(owner).createTodo("Eat right now...", "What should i eat now nitori olohun");
      await todoList.connect(owner).createTodo("Don't know what to eat", "Am hungry oooo");

      const todos = await todoList.getAllTodo();
      expect(todos.length).to.equal(2);
      expect(todos[0].title).to.equal("Eat right now...");
      expect(todos[1].title).to.equal("Don't know what to eat");
    });
  });

  describe("Completing a todo", function () {
    it("Should mark a todo as completed", async function () {
      const { todoList, owner } = await loadFixture(deployTodoListFixture);
      await todoList.connect(owner).createTodo("Todo title", "Todo Description");

      await todoList.connect(owner).todoCompleted(0);

      const todo = await todoList.getTodo(0);
      expect(todo[2]).to.equal(3);
    });
  });

  describe("Deleting a todo", function () {
    it("Should delete a todo", async function () {
      const { todoList, owner } = await loadFixture(deployTodoListFixture);
      await todoList.connect(owner).createTodo("Todo 1", "Description 1");
      await todoList.connect(owner).createTodo("Todo 2", "Description 2");

      await todoList.connect(owner).deleteTodo(0);

      const todos = await todoList.getAllTodo();
      expect(todos.length).to.equal(1);
      expect(todos[0].title).to.equal("Todo 2");
    });

    it("Should revert if index is out of bounds", async function () {
      const { todoList, owner } = await loadFixture(deployTodoListFixture);
      await expect(todoList.connect(owner).deleteTodo(0)).to.be.revertedWith(
        "Index is out-of-bounds"
      );
    });
  });
});
