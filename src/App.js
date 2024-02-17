import {Component} from 'react'

import Loader from 'react-loader-spinner'
import ProjectItems from './compoennts/ProjectItems'

import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'

import './App.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

// Replace your code here

const apiStatusConstants = {
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
  initial: 'INITIAL',
}

class App extends Component {
  state = {
    projectsList: [],
    activeCategoryId: categoriesList[0].id,
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProjectsData()
  }

  getProjectsData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const {activeCategoryId} = this.state

    const apiUrl = ` https://apis.ccbp.in/ps/projects?category=${activeCategoryId}`
    const response = await fetch(apiUrl)
    const data = await response.json()
    if (response.ok === true) {
      const updatedData = data.projects.map(eachItem => ({
        id: eachItem.id,
        name: eachItem.name,
        imageUrl: eachItem.image_url,
      }))
      this.setState({
        projectsList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onSelectCategory = event => {
    this.setState({activeCategoryId: event.target.value}, this.getProjectsData)
  }

  renderLoadingView = () => (
    <div className="load" data-testid="loader">
      <Loader type="ThreeDots" color="#00BFFF" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
      />
      <h1 className="heading">Oops! Something Went Wrong</h1>
      <p className="para">
        We cannot seem to find the page you are looking for
      </p>
      <button className="button" type="button" onClick={this.getProjectsData}>
        Retry
      </button>
    </div>
  )

  renderSuccessView = () => {
    const {projectsList} = this.state
    return (
      <div className="q-con">
        <ul className="app-con">
          {projectsList.map(eachProject => (
            <ProjectItems projectDetails={eachProject} key={eachProject.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderBasedOnApiStatus = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    const {activeCategoryId} = this.state
    return (
      <div>
        <nav className="nav-el">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            className="web"
            alt="website logo"
          />
        </nav>
        <div className="main-con">
          <ul className="sel-con">
            <select
              className="sel"
              value={activeCategoryId}
              onChange={this.onSelectCategory}
            >
              {categoriesList.map(eachCategory => (
                <option value={eachCategory.id} key={eachCategory.id}>
                  {eachCategory.displayText}
                </option>
              ))}
            </select>
          </ul>
          {this.renderBasedOnApiStatus()}
        </div>
      </div>
    )
  }
}
export default App
