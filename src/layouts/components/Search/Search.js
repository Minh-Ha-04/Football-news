import {  faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tippy from '@tippyjs/react/headless';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import styles from './Search.module.scss';
import classNames from 'classnames/bind';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

function Search() {
    const [searchValue, setSearchValue] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [teams, setTeams] = useState([]);
    const inputRef = useRef();
    const navigate = useNavigate();

    // Lấy danh sách đội bóng
    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await axios.get('http://localhost:5000/team');
                if (response.data.success) {
                    setTeams(response.data.data);
                }
            } catch (error) {
                console.error('Lỗi khi lấy danh sách đội bóng:', error);
            }
        };
        fetchTeams();
    }, []);

    useEffect(() => {
        if (!searchValue.trim()) {
            setSearchResult([]);
            return;
        }

        // Tìm kiếm đội bóng dựa trên tên
        const filteredTeams = teams.filter(team => 
            team.name.toLowerCase().includes(searchValue.toLowerCase()) ||
            team.shortName.toLowerCase().includes(searchValue.toLowerCase())
        );
        setSearchResult(filteredTeams);
    }, [searchValue, teams]);

    const handleHideResult = () => {
        setSearchValue('');
        setSearchResult([]);
    };

    const handleSearchItemClick = async (team) => {
        try {
            // Lấy các bài viết có tag trùng với tên đội bóng
            const response = await axios.get(`http://localhost:5000/articles/search?tag=${team.name}`);
            navigate('/result', { 
                state: { 
                    results: response.data || [], // Đảm bảo luôn có mảng, ngay cả khi không có kết quả
                    searchTerm: team.name,
                    teamInfo: team
                } 
            });
        } catch (error) {
            console.error('Lỗi khi tìm bài viết:', error);
            // Vẫn chuyển đến trang Result với mảng rỗng khi có lỗi
            navigate('/result', { 
                state: { 
                    results: [],
                    searchTerm: team.name,
                    teamInfo: team
                } 
            });
        }
        handleHideResult();
    };

    const handleSearch = async () => {
        if (searchResult.length > 0) {
            try {
                // Lấy tất cả bài viết liên quan đến các đội bóng trong kết quả tìm kiếm
                const allArticles = [];
                const searchPromises = searchResult.map(team => 
                    axios.get(`http://localhost:5000/articles/search?tag=${team.name}`)
                );

                const responses = await Promise.all(searchPromises);
                responses.forEach((response, index) => {
                    if (response.data && response.data.length > 0) {
                        // Thêm thông tin đội bóng vào mỗi bài viết
                        const articlesWithTeam = response.data.map(article => ({
                            ...article,
                            teamInfo: searchResult[index]
                        }));
                        allArticles.push(...articlesWithTeam);
                    }
                });

                // Luôn chuyển hướng đến trang kết quả, kể cả khi không có bài viết
                navigate('/result', {
                    state: {
                        results: allArticles,
                        searchTerm: searchValue,
                        teams: searchResult // Gửi thông tin tất cả đội bóng tìm thấy
                    }
                });
            } catch (error) {
                console.error('Lỗi khi tìm bài viết:', error);
                // Vẫn chuyển đến trang Result với mảng rỗng khi có lỗi
                navigate('/result', {
                    state: {
                        results: [],
                        searchTerm: searchValue,
                        teams: searchResult
                    }
                });
            }
            handleHideResult();
        }
    };

    return (
        <div className={cx('wrapper')}>
            <Tippy
                interactive
                visible={searchValue.length > 0}
                render={(attrs) => (
                    <div className={cx('search-result')} tabIndex="-1" {...attrs}>
                        <PopperWrapper>
                            {searchResult.length > 0 ? (
                                searchResult.slice(0, 5).map((team) => (
                                    <div 
                                        key={team._id} 
                                        onClick={() => handleSearchItemClick(team)}
                                        className={cx('team-item')}
                                    >
                                        <img src={team.logo} alt={team.name} className={cx('team-logo')} />
                                        <div className={cx('team-info')}>
                                            <span className={cx('team-name')}>{team.name}</span>
                                            <span className={cx('team-shortname')}>{team.shortName}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className={cx('no-result')}>Không tìm thấy đội bóng</div>
                            )}
                        </PopperWrapper>
                    </div>
                )}
                onClickOutside={handleHideResult}
            >
                <div className={cx('search')}>
                    <input
                        ref={inputRef}
                        value={searchValue}
                        placeholder="Tìm kiếm đội bóng"
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                    <button 
                        className={cx('search-btn', { disabled: searchResult.length === 0 })}
                        onClick={handleSearch}
                        disabled={searchResult.length === 0}
                    >
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </button>
                </div>
            </Tippy>
        </div>
    );
}

export default Search;
