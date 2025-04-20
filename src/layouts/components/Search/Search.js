import {  faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tippy from '@tippyjs/react/headless';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import SearchItem from '~/components/SearchItem';
import styles from './Search.module.scss';
import classNames from 'classnames/bind';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

function Search() {
    const [searchValue, setSearchValue] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const inputRef = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!searchValue.trim()) {
                setSearchResult([]);
                return;
            }

            try {
                const response = await axios.get(`http://localhost:5000/articles/search?tag=${searchValue}`);
                setSearchResult(response.data);
            } catch (error) {
                console.error('Error searching articles:', error);
                setSearchResult([]);
            }
        };

        const debounceTimer = setTimeout(fetchSearchResults, 500);
        return () => clearTimeout(debounceTimer);
    }, [searchValue]);


    const handleHideResult = () => {
        setSearchValue('');
        setSearchResult([]);
    };

    const handleSearchItemClick = () => {
        handleHideResult();
    };

    const handleSearch = () => {
        if (searchResult.length > 0) {
            navigate('/result', { state: { results: searchResult, searchTerm: searchValue } });
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
                                searchResult.slice(0, 5).map((article) => (
                                    <div key={article._id} onClick={handleSearchItemClick}>
                                        <SearchItem
                                            slug={article.slug}
                                            title={article.title}
                                            image={article.image}
                                            description={article.description}

                                        />
                                    </div>
                                ))
                            ) : (
                                <div className={cx('no-result')}>Không tìm thấy kết quả</div>
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
                        placeholder="Tìm kiếm bài viết"
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
