const jobsContainer = document.querySelector(".todo-list > ul");
const customBtns = document.querySelectorAll(".filter > ul > li");
const inputJob = document.querySelector(".input-todo input");
const addBtn = document.querySelector(".input-todo button");

const App = {
  status: "All",

  jobs: localStorage.getItem("jobs")
    ? JSON.parse(localStorage.getItem("jobs"))
    : [
        {
          id: 1,
          name: undefined,
          status: undefined,
        },
      ],

  handleAdd() {
    addBtn.onclick = () => {
      var id = Math.floor(Math.random() * 1000);
      console.log(inputJob.value);
      let job = {
        id: id,
        name: inputJob.value,
        status: "Processing",
      };
      inputJob.value = "";
      inputJob.focus();
      this.jobs.push(job);
      console.log(this.jobs);
      this.render(this.jobs);
      customBtns.forEach((button) => {
        button.classList.remove("active");
        if (button.id === "All") {
          button.classList.add("active");
        }
      });
      localStorage.setItem("jobs", JSON.stringify(this.jobs));
    };
  },

  handleFilter(jobs, status) {
    var newJobs = Array.from(jobs).filter((job) => {
      if (job) {
        return job.status === status;
      }
    });
    console.log(newJobs);
    return newJobs;
  },

  updateJob(index, element) {
    let _this = this;
    index = parseInt(index);
    this.jobs.forEach((job, pos) => {
      console.log(index, " ", job.id);
      if (index === job.id) {
        console.log(this.jobs[pos]);
        _this.jobs[pos] = {
          ..._this.jobs[pos],
          status: element.checked ? "Completed" : "Processing",
        };
      }
    });
    localStorage.setItem("jobs", JSON.stringify(this.jobs));
  },

  handleClick(event) {
    const element = event.target.closest("label");
    if (element) {
      const checkbox = element.querySelector("input");
      console.log(checkbox.id);
      if (checkbox.checked) {
        checkbox.checked = false;
        localStorage.setItem("jobs", JSON.stringify(this.jobs));
        this.updateJob(checkbox.id, checkbox);
      } else {
        checkbox.checked = true;
        localStorage.setItem("jobs", JSON.stringify(this.jobs));
        this.updateJob(checkbox.id, checkbox);
      }
    }
  },

  handleDelete(event) {
    let elementId = parseInt(
      event.target.closest(".job").querySelector("input").id
    );
    this.jobs.forEach((job, index) => {
      if (job.id === elementId) {
        this.jobs.splice(index, 1);

        customBtns.forEach((btn) => {
          if (btn.classList.contains("active")) {
            switch (btn.id) {
              case "All":
                this.render(this.jobs);
                break;
              case "Completed":
                this.render(this.handleFilter(this.jobs, btn.id));
                break;
              case "Processing":
                this.render(this.handleFilter(this.jobs, btn.id));
                break;
            }
          }
        });
        localStorage.setItem("jobs", JSON.stringify(this.jobs));
      }
    });
  },

  render(jobs) {
    let html = jobs.map((job, index) => {
      if (job.name && job.status) {
        return `<li class="job" id="j-1" onclick="App.handleClick(event)" data-index=${index}>
                    <label for=${job.id}>
                        <input id=${job.id} type="checkbox" ${
          job.status === "Processing" ? "" : "checked"
        }>
                        <p>${job.name}</p>
                        </label>
                        <div
                            onclick="App.handleDelete(event)"
                        class="delete"
                        >&times;</div>
                        </li>`;
      }
    });
    jobsContainer.innerHTML = html.join("");
  },

  handleCustomRender() {
    customBtns.forEach((btn) => {
      btn.onclick = () => {
        customBtns.forEach((button) => {
          if (button != btn) {
            button.classList.remove("active");
          }
        });
        btn.classList.add("active");
        switch (btn.id) {
          case "All":
            this.render(this.jobs);
            break;
          case "Completed":
            this.render(this.handleFilter(this.jobs, btn.id));
            break;
          case "Processing":
            this.render(this.handleFilter(this.jobs, btn.id));
            break;
        }
      };
    });
  },

  start() {
    this.render(this.jobs);
    this.handleAdd();
    this.handleCustomRender();
  },
};

App.start();
