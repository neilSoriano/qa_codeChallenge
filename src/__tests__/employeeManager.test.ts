import { EmployeeHandler } from "./pageObjects/EmployeeHandler";

const em = new EmployeeHandler();

describe("Employee Manager", () => {
  beforeEach(async () => {
    await em.navigate();
  });
  afterAll(async () => {
    await em.quit();
  });
  it("can add a new employee", async () => {
    await em.addEmployee();
    await em.selectEmployeeByName("New Employee");
    await em.editEmployee({
      name: "test person",
      phone: "1234567890",
      title: "test result",
    });
    await em.saveChanges();
    await em.selectEmployeeByName("Dollie Berry");
    await em.selectEmployeeByName("test person");
    let employee = await em.getEmployeeInfo();
    expect(employee.name).toEqual("test person");
    expect(employee.phone).toEqual("1234567890");
    expect(employee.title).toEqual("test result");
  });
  it("can edit an existing employee", async () => {
    await em.selectEmployeeByName("Bernice Ortiz");
    await em.editEmployee({ title: "Grand Poobah" });
    await em.saveChanges();
    await em.selectEmployeeByName("Phillip Weaver");
    await em.selectEmployeeByName("Bernice Ortiz");
    let employee = await em.getEmployeeInfo();
    expect(employee).toEqual({
      id: 1,
      name: "Bernice Ortiz",
      phone: "4824931093",
      title: "Grand Poobah",
    });
  });
  it("can add another employee", async () => {
    await em.addEmployee();
    await em.selectEmployeeByName("New Employee");
    await em.editEmployee({
      name: "Neil Soriano",
      phone: "0824781627",
      title: "QA Engineer"
    });
    await em.saveChanges();
    await em.selectEmployeeByName("Bernice Ortiz");
    await em.selectEmployeeByName("Neil Soriano");
    let employee = await em.getEmployeeInfo();
    expect(employee.name).toEqual("Neil Soriano");
    expect(employee.phone).toEqual("0824781627");
    expect(employee.title).toEqual("QA Engineer");
  });
  it("can cancel the edit of an employee", async () => {
    await em.selectEmployeeByName("Dollie Berry");
    await em.editEmployee({ title: "Software Engineer" });
    await em.cancelChanges();
    await em.selectEmployeeByName("Phillip Weaver");
    await em.selectEmployeeByName("Dollie Berry");
    let employee = await em.getEmployeeInfo();
    expect(employee.title).toEqual("Front-End Developer");
  });
  it("cannot save changes when editing and navigating away without saving changes", async () => {
    await em.selectEmployeeByName("Dollie Berry");
    await em.editEmployee({ name: "Neil Soriano", phone: "123456789", title: "Software Engineer" });
    await em.selectEmployeeByName("Teresa Osborne");
    await em.selectEmployeeByName("Dollie Berry");
    let employee = await em.getEmployeeInfo();
    expect(employee.name).toEqual("Dollie Berry");
    expect(employee.phone).toEqual("4873459812");
    expect(employee.title).toEqual("Front-End Developer");
  })
});
