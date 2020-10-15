import React from 'react';
import PropTypes from 'prop-types';
import {
  FaUser,
  FaStar,
  FaCodeBranch,
  FaExclamationTriangle,
} from 'react-icons/fa';

import Card from './Card';
import Loading from './Loading';
import { fetchPopularRepos } from '../services/api';

function Navbar({ selectedLanguage, onLanguageSelect }) {
  const languages = ['All', 'JavaScript', 'Ruby', 'Java', 'CSS', 'Python'];
  return (
    <ul className="flex-center">
      {languages.map((language, index) => (
        <li key={index}>
          <button
            className="btn-clear nav-link"
            onClick={() => onLanguageSelect(language)}
            style={
              language === selectedLanguage
                ? { color: 'rgb(187, 46, 32)' }
                : null
            }
          >
            {language}
          </button>
        </li>
      ))}
    </ul>
  );
}

Navbar.propTypes = {
  selectedLanguage: PropTypes.string.isRequired,
  onLanguageSelect: PropTypes.func.isRequired,
};

function ReposGrid({ repos }) {
  return (
    <ul className="grid space-around">
      {repos.map((repo, index) => {
        const { owner, html_url, stargazers_count, forks, open_issues } = repo;
        const { login, avatar_url } = owner;

        return (
          <li key={html_url}>
            <Card
              header={`#${index + 1}`}
              avatar={avatar_url}
              href={html_url}
              name={login}
            >
              <ul className="card-list">
                <li>
                  <FaUser color="rgb(255, 191, 116)" size={22} />
                  <a href={`https://github.com/${login}`}>{login}</a>
                </li>
                <li>
                  <FaStar color="rgb(255, 215, 0)" size={22} />
                  {stargazers_count.toLocaleString()} stars
                </li>
                <li>
                  <FaCodeBranch color="rgb(129, 195, 245)" size={22} />
                  {forks.toLocaleString()} forks
                </li>
                <li>
                  <FaExclamationTriangle color="rgb(241, 138, 147)" size={22} />
                  {open_issues.toLocaleString()} open
                </li>
              </ul>
            </Card>
          </li>
        );
      })}
    </ul>
  );
}

ReposGrid.propTypes = {
  repos: PropTypes.array.isRequired,
};

export default class Popular extends React.Component {
  state = {
    selectedLanguage: 'All',
    repos: {},
    error: null,
  };

  componentDidMount() {
    this.updateLanguage(this.state.selectedLanguage);
  }

  updateLanguage = (language) => {
    this.setState({
      selectedLanguage: language,
      error: null,
    });

    if (!this.state.repos[language]) {
      fetchPopularRepos(language)
        .then((repos) => {
          this.setState((prevState) => ({
            repos: {
              ...prevState.repos,
              [language]: repos,
            },
          }));
        })
        .catch((error) => {
          this.setState({
            error: 'There was an while fetching the repositories.',
          });
        });
    }
  };

  isLoading() {
    return (
      !this.state.repos[this.state.selectedLanguage] &&
      this.state.error === null
    );
  }

  render() {
    const { selectedLanguage, repos, error } = this.state;

    return (
      <>
        <Navbar
          selectedLanguage={selectedLanguage}
          onLanguageSelect={this.updateLanguage}
        />

        {this.isLoading() && <Loading text="Fetching Repos" />}

        {error && <p>{error}</p>}

        {repos[selectedLanguage] && (
          <ReposGrid repos={repos[selectedLanguage]} />
        )}
      </>
    );
  }
}
