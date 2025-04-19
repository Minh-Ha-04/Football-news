import { faCircleXmark, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tippy from '@tippyjs/react/headless';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import SearchItem from '~/components/SearchItem';
import styles from './Search.module.scss';
import classNames from 'classnames/bind';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const cx = classNames.bind(styles);

function Search() {
    const [searchValue, setSearchValue] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showResult, setShowResult] = useState(true);
    const inputRef = useRef();

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!searchValue.trim()) {
                setSearchResult([]);
                return;
            }

            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:5000/articles/search?tag=${searchValue}`);
                setSearchResult(response.data);
            } catch (error) {
                console.error('Error searching articles:', error);
                setSearchResult([]);
            } finally {
                setLoading(false);
            }
        };

        const debounceTimer = setTimeout(fetchSearchResults, 500);
        return () => clearTimeout(debounceTimer);
    }, [searchValue]);

    const handleClear = () => {
        setSearchValue('');
        setSearchResult([]);
        inputRef.current.focus();
    };

    const handleHideResult = () => {
        setSearchValue('');
        setSearchResult([]);
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
                                searchResult.map((article) => (
                                    <SearchItem
                                        key={article._id}
                                        slug={article.slug}
                                        title={article.title}
                                        image={article.image}
                                    />
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
                        onFocus={() => setShowResult(true)}
                    />
                    {!!searchValue && (
                        <button className={cx('clear')} onClick={handleClear}>
                            <FontAwesomeIcon icon={faCircleXmark} />
                        </button>
                    )}
                    <button className={cx('search-btn')}>
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </button>
                </div>
            </Tippy>
        </div>
    );
}

export default Search;
