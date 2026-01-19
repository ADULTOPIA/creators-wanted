import React from 'react';
import { useTranslation } from 'react-i18next';
import '../i18n';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';

import Footer from '../components/Footer';
import DescriptionTitleWithImage from '../components/DescriptionTitleWithImage';

const Page = styled.div`
  padding-top: 0;
  background: #ffffff;
  color: #111;
`;
const HeroBadge = styled.div`
  position: absolute;
  right: 16px;
  top: 16px;
  background: #fff;
  border-radius: 0;
  padding: 0;
  font-weight: 800;
  font-size: 12px;
  line-height: 1.2;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.14);
  text-align: center;
  span {
    display: block;
    font-size: 18px;
  }
`;




const HeroWrap = styled.section`
  background: #fff;
  padding: 0;
  width: 100%;
  margin-left: 0;
`;

const HeroCard = styled.div`
  position: relative;
  border-radius: 0;
  overflow: hidden;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.12);
  width: 100%;
`;


const HeroImg = styled.img`
  display: block;
  width: 100%;
  height: auto;
`;
const SetumeiImg = styled.img`
  display: block;
  width: 90%;
  height: auto;
  margin: 0 auto;
`;

const HomePage: React.FC = () => {
  const { t, i18n } = useTranslation();
  // ファイルinputのref
  const promo1Ref = React.useRef<HTMLInputElement | null>(null);
  const promo2Ref = React.useRef<HTMLInputElement | null>(null);
  // HERO画像の切り替え
  const [heroSrc, setHeroSrc] = React.useState(`${process.env.PUBLIC_URL}/adultopia/hero.jpg`);
  React.useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const updateSrc = () => {
      setHeroSrc(mq.matches
        ? `${process.env.PUBLIC_URL}/adultopia/hero1080.jpg`
        : `${process.env.PUBLIC_URL}/adultopia/hero.jpg`
      );
    };
    updateSrc();
    mq.addEventListener('change', updateSrc);
    return () => mq.removeEventListener('change', updateSrc);
  }, []);

  // 言語選択UI用のstate
  const [langMenuOpen, setLangMenuOpen] = React.useState(false);
  const LANGUAGES = [
    { code: 'zh-TW', label: '繁體中文' },
    { code: 'ja', label: '日本語' },
    { code: 'ko', label: '한국어' },
  ];

  // フォーム全体の状態
  // 必須項目のバリデーション
  const [formData, setFormData] = React.useState({
    realName: '',
    email: '',
    phone: '',
    idNumber: '',
    facebook: '',
    instagram: '',
    twitter: '',
    otherSocial: '',
    boothType: 'standard',
    creatorName1: '',
    creatorName2: '',
    boothName: '',
    boothSubtitle: '',
    lanternName: '',
    lanternSubtitle: '',
    promo1: null as File | null,
    promo2: null as File | null,
    hardware: '',
    remarks: '',
    entryDays: [] as string[], // 新項目: 参加日
    recommender: '', // 新項目: 推薦人
  });
  const isFormValid = () => {
    // 必須項目
    const requiredFields = [
      formData.realName,
      formData.email,
      formData.phone,
      formData.idNumber,
        formData.entryDays.length > 0, // 参加日が1つ以上選択されているか
      formData.creatorName1,
      formData.boothName,
      formData.lanternName,
      formData.promo1,
      formData.promo2,
      formData.boothType,
    ];
    // boothTypeがdoubleならcreatorName2も必須
    if (formData.boothType === 'double' && !formData.creatorName2) return false;
    // lanternNameは最大6文字
    if (formData.lanternName && formData.lanternName.length > 6) return false;
    // すべての必須項目が入力されているか
    return requiredFields.every(f => f && (typeof f === 'string' ? f.trim() !== '' : true));
  };
  // boothType変更時のハンドラ
  const handleBoothTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      boothType: value,
      // boothTypeがstandardなら2人目を空に
      creatorName2: value === 'double' ? prev.creatorName2 : ''
    }));
  };
  // 各inputのonChange汎用ハンドラ
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, files } = e.target as HTMLInputElement;
    if (type === 'checkbox' && name === 'entryDays') {
      const checked = (e.target as HTMLInputElement).checked;
      const dayValue = value;
      setFormData(prev => {
        const newDays = checked
          ? [...prev.entryDays, dayValue]
          : prev.entryDays.filter(d => d !== dayValue);
        return { ...prev, entryDays: newDays };
      });
      return;
      }
    if (type === 'file') {
      setFormData(prev => ({ ...prev, [name]: files && files[0] ? files[0] : null }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  // 送信状態
  const [status, setStatus] = React.useState({
    submitted: false,
    submitting: false,
    info: { error: false, msg: null as string | null }
  });
  // 送信ハンドラ
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({
      submitted: false,
      submitting: true,
      info: { error: false, msg: null }
    });

    // GASへ宣傳素材アップロード
    async function uploadToGAS(
      creatorName: string,
      promo1File: File,
      promo2File: File
    ) {
      const readFileAsBase64 = (file: File) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result;
            if (typeof result === 'string') resolve(result.split(',')[1] || '');
            else resolve('');
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

      const payload = {
        creatorName,
        promo1: {
          originalName: promo1File.name,
          mimeType: promo1File.type,
          base64: await readFileAsBase64(promo1File),
        },
        promo2: {
          originalName: promo2File.name,
          mimeType: promo2File.type,
          base64: await readFileAsBase64(promo2File),
        },
      };

      // CORSでレスポンス読めないので no-cors（投げ捨て）
      await fetch('https://script.google.com/macros/s/AKfycbw5C79W1npp52_FE7S4gh18rqRnNlHkS17KXKSzLNfQCvL2GHF6BNACs--MlCCIDpgnAA/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // preflight回避寄り
        body: JSON.stringify(payload),
      });

      return "sent";
    }

    try {
      // 宣傳素材1・2をGASへアップロード
      const creatorName = formData.creatorName1;
      if (!creatorName || !formData.promo1 || !formData.promo2) throw new Error('宣傳素材與創作者姓名為必填');
      await uploadToGAS(creatorName, formData.promo1, formData.promo2);

      // Google Formsの送信URL
      const googleFormURL = 'https://docs.google.com/forms/d/e/1FAIpQLSf_NWlZr8vrppypusKQvZbg5NSsZRqCwsHyETgxjWvqfhXNDA/formResponse';

      // フォームデータの作成
      const formEntryData = new FormData();
      formEntryData.append('entry.223524045', formData.realName); // 真實姓名
      formEntryData.append('entry.1232177201', formData.email); // Email
      formEntryData.append('entry.472609669', formData.phone); // 聯絡電話
      formEntryData.append('entry.737699764', formData.idNumber); // 身分證字號 / 護照號碼
      formEntryData.append('entry.1746982220', formData.facebook); // Facebook
      formEntryData.append('entry.751341583', formData.instagram); // Instagram
      formEntryData.append('entry.612151145', formData.twitter); // X（Twitter）
      formEntryData.append('entry.992573759', formData.otherSocial); // 其他社群
        // 新項目: 参加日（複数可）
        formData.entryDays.forEach(day => {
          formEntryData.append('entry.118036694', day);
        });
      formEntryData.append('entry.71172756', formData.boothType === 'double' ? '雙人攤位' : '標準攤位'); // 攤位類型（ラジオボタン）
      formEntryData.append('entry.879795608', formData.creatorName1); // 創作者姓名1
      if (formData.boothType === 'double') formEntryData.append('entry.42970170', formData.creatorName2); // 創作者姓名2
      formEntryData.append('entry.342299385', formData.boothName); // 攤位名稱
      formEntryData.append('entry.251903871', formData.boothSubtitle); // 攤位副標
      formEntryData.append('entry.975159553', formData.lanternName); // 燈籠名稱
      formEntryData.append('entry.854719392', formData.lanternSubtitle); // 燈籠副標
      // 宣傳素材はGASでアップロード済みなので「創作者姓名_宣傳素材1」「創作者姓名_宣傳素材2」の形式で入れる
      formEntryData.append('entry.722087227', formData.creatorName1 ? `${formData.creatorName1}_宣傳素材1` : ''); // 宣傳素材1
      formEntryData.append('entry.842328103', formData.creatorName1 ? `${formData.creatorName1}_宣傳素材2` : ''); // 宣傳素材2
      formEntryData.append('entry.1340388620', formData.hardware); // 額外硬體需求
      formEntryData.append('entry.1539071706', formData.remarks); // 備註

      // 新項目: 推薦人
      formEntryData.append('entry.1506048127', formData.recommender);

      // fetch APIで送信
      await fetch(googleFormURL, {
        method: 'POST',
        mode: 'no-cors',
        body: formEntryData
      });

      setStatus({
        submitted: true,
        submitting: false,
        info: { error: false, msg: '送出完成，感謝您的報名！' }
      });
      // フォームリセット
      setFormData({
        realName: '',
        email: '',
        phone: '',
        idNumber: '',
        facebook: '',
        instagram: '',
        twitter: '',
        otherSocial: '',
        boothType: 'standard',
        creatorName1: '',
        creatorName2: '',
        boothName: '',
        boothSubtitle: '',
        lanternName: '',
        lanternSubtitle: '',
        promo1: null,
        promo2: null,
        hardware: '',
        remarks: '',
        entryDays: [],
        recommender: '',
      });
      // ファイルinputもリセット
      if (promo1Ref.current) promo1Ref.current.value = '';
      if (promo2Ref.current) promo2Ref.current.value = '';
    } catch (error) {
      setStatus({
        submitted: false,
        submitting: false,
        info: { error: true, msg: '送出時發生錯誤，請稍後再試。' }
      });
    }
  };

  return (
    <Page>
      <Helmet>
        <title>{t('pageTitle', '創作者募集｜2026 Adultopia 大人國')}</title>
        <meta
          name="description"
          content={t('metaDescription', '2026 Adultopia 大人國｜創作者募集')}
        />
        <meta property="og:title" content={t('ogTitle', 'Creators Wanted｜Adultopia 大人國')} />
        <meta property="og:description" content={t('ogDescription', '2026 Adultopia 大人國｜創作者募集')} />
        <meta property="og:image" content="/adultopia/og.jpg" />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* HERO */}
      <HeroWrap>
        <HeroCard>
          <HeroImg
            src={heroSrc}
            alt={t('heroAlt', 'ADULTOPIA 大人國 2026 Creators Wanted')}
          />
          {/* 言語切替ボタン（画面右上に固定） */}
          <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 1000 }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <button
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 4, border: '1px solid #ccc', background: '#fff', cursor: 'pointer',color: '#222', fontWeight: 600 }}
                onClick={() => setLangMenuOpen(open => !open)}
                aria-label="Change language"
              >
                {/* 地球アイコン */}
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 0 20"/><path d="M12 2a15.3 15.3 0 0 0 0 20"/></svg>
                <span>Language</span>
              </button>
              {langMenuOpen && (
                <ul style={{
                  position: 'absolute',
                  top: '110%',
                  right: 0,
                  minWidth: 120,
                  background: '#fff',
                  border: '1px solid #ccc',
                  borderRadius: 4,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                  padding: 0,
                  margin: 0,
                  zIndex: 1001,
                }}>
                  {LANGUAGES.map(lang => (
                    <li key={lang.code} style={{ listStyle: 'none' }}>
                      <button
                        style={{
                          width: '100%',
                          padding: '8px 16px',
                          background: i18n.language === lang.code ? '#eee' : '#fff',
                          color: '#222',
                          border: 'none',
                          textAlign: 'left',
                          cursor: 'pointer',
                        }}
                        onClick={() => {
                          i18n.changeLanguage(lang.code);
                          setLangMenuOpen(false);
                          const url = new URL(window.location.href);
                          url.searchParams.set('lng', lang.code);
                          window.history.replaceState(null, '', url.toString());
                        }}
                      >
                        {lang.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </HeroCard>
      </HeroWrap>
      <DescriptionBox>
        <DescriptionTitle>
          <DescriptionTitleWithImage imgSrc={process.env.PUBLIC_URL + '/adultopia/logoHeart.png'} imgAlt="ロゴ">
            {t('activityInfoTitle', '活動資訊')}
          </DescriptionTitleWithImage>
        </DescriptionTitle>
        <DescriptionText>
          {t('activityInfo', '活動名稱：2026 Adultopia 大人國\n活動日期：2026/03/28-2026/03/29\n　創作者入場時間：09:00-18:00\n　快通票入場時間：09:30-18:00\n　一般票入場時間：10:00-18:00\n活動地點：桃園會展中心\n活動地址：桃園市中壢區領航北路一段99號').split('\n').map((line: string, i: number) => (<React.Fragment key={i}>{line}<br/></React.Fragment>))}
        </DescriptionText>
        <DescriptionTitle>
          <DescriptionTitleWithImage imgSrc={process.env.PUBLIC_URL + '/adultopia/logoHeart.png'} imgAlt="ロゴ">
            {t('boothRecruitTitle', '攤位報名資訊')}
          </DescriptionTitleWithImage>
        </DescriptionTitle>
        <DescriptionText>
          {t('boothRecruitInfo', '攤位招募時間：2026/01/10 開放線上報名\n招募截止時間：2026/01/31 截止報名\n攤位數量：\n　單人攤位每日____攤\n　雙人攤位每日____攤\n招募類型：Cosplay、寫真、KOL、動漫周邊、同人誌').split('\n').map((line: string, i: number) => (<React.Fragment key={i}>{line}<br/></React.Fragment>))}
        </DescriptionText>
        <DescriptionTitle>
          <DescriptionTitleWithImage imgSrc={process.env.PUBLIC_URL + '/adultopia/logoHeart.png'} imgAlt="ロゴ">
            {t('boothInfoTitle', '攤位資訊')}
          </DescriptionTitleWithImage>
        </DescriptionTitle>
      </DescriptionBox>

      {/* 説明画像1 */}
      <SectionImages>
        <SetumeiImg
          src={i18n.language === 'ja' ? `${process.env.PUBLIC_URL}/adultopia/setumei1_ja.jpg` : `${process.env.PUBLIC_URL}/adultopia/setumei1.jpg`}
          alt="説明画像1"
        />
      </SectionImages>

      {/* 説明画像2 */}
      <SectionImages>
        <SetumeiImg
          src={i18n.language === 'ja' ? `${process.env.PUBLIC_URL}/adultopia/setumei2_ja.jpg` : `${process.env.PUBLIC_URL}/adultopia/setumei2.jpg`}
          alt="説明画像2"
        />
      </SectionImages>
      {/* 説明画像3 */}
      <SectionImages>
        <SetumeiImg
          src={i18n.language === 'ja' ? `${process.env.PUBLIC_URL}/adultopia/setumei3_ja.jpg` : `${process.env.PUBLIC_URL}/adultopia/setumei3.jpg`}
          alt="説明画像3"
        />
      </SectionImages>
      {/* 説明画像4 */}
      <SectionImages>
        <SetumeiImg
          src={i18n.language === 'ja' ? `${process.env.PUBLIC_URL}/adultopia/setumei4_ja.jpg` : `${process.env.PUBLIC_URL}/adultopia/setumei4.jpg`}
          alt="説明画像4"
        />
      </SectionImages>
      {/* 説明画像5 */}
      <SectionImages>
        <SetumeiImg
          src={i18n.language === 'ja' ? `${process.env.PUBLIC_URL}/adultopia/setumei5_ja.jpg` : `${process.env.PUBLIC_URL}/adultopia/setumei5.jpg`}
          alt="説明画像5"
        />
      </SectionImages>
      <DescriptionBox>
        <DescriptionTitle>
          <DescriptionTitleWithImage imgSrc={process.env.PUBLIC_URL + '/adultopia/logoHeart.png'} imgAlt="ロゴ">
            {t('formProcess', '報名流程')}
          </DescriptionTitleWithImage>
        </DescriptionTitle>
      </DescriptionBox>
      {/* プロセス画像（言語対応） */}
      <SectionImages>
        <SetumeiImg
          src={i18n.language === 'ja' ? `${process.env.PUBLIC_URL}/adultopia/process_ja.jpg` : `${process.env.PUBLIC_URL}/adultopia/process.jpg`}
          alt="プロセス画像"
        />
      </SectionImages>
      <DescriptionBox>
        <DescriptionTitle>
          <DescriptionTitleWithImage imgSrc={process.env.PUBLIC_URL + '/adultopia/logoHeart.png'} imgAlt="ロゴ">
            {t('entryGuide', '報名簡章')}
          </DescriptionTitleWithImage>
        </DescriptionTitle>
            <DescriptionText as="div">
              {i18n.language === 'zh-TW' && (
                <LinkBlock>
                  <UnderlinedLink href="https://drive.google.com/file/d/1WasayDe3m4j_40xTY15jcM-Bg2fFvCIy/view?usp=sharing" target="_blank" rel="noopener noreferrer">{t('entryGuide', '中文報名簡章')}</UnderlinedLink>
                </LinkBlock>
              )}
              {i18n.language === 'ja' && (
                <LinkBlock>
                  <UnderlinedLink href="https://drive.google.com/file/d/1gKienFXdzh1scliEx2OWsX18CvqBXAmw/view?usp=drive_link" target="_blank" rel="noopener noreferrer">{t('entryGuide', '日文報名簡章')}</UnderlinedLink>
                </LinkBlock>
              )}
              {i18n.language === 'ko' && (
                <LinkBlock>
                  <UnderlinedLink href="https://drive.google.com/file/d/1zaYTqjBmS7A4a3SEUju2woYeKUlt1d9b/view?usp=drive_link" target="_blank" rel="noopener noreferrer">{t('entryGuide', '韓文報名簡章')}</UnderlinedLink>
                </LinkBlock>
              )}
            </DescriptionText>
      </DescriptionBox>
      <DescriptionBox>
        <DescriptionTitle>
          <DescriptionTitleWithImage imgSrc={process.env.PUBLIC_URL + '/adultopia/logoHeart.png'} imgAlt="ロゴ">
            {t('boothEntryTitle', '攤位報名資料填寫')}
          </DescriptionTitleWithImage>
        </DescriptionTitle>
      </DescriptionBox>
        {/* 報名フォーム（見た目のみ） */}
        <FormSection>
          <FormTitle>{t('formTitle', '報名表單')}</FormTitle>
          <StyledForm onSubmit={handleSubmit}>
            <SectionLabel>{t('sectionBasic', '基本資料')}</SectionLabel>
            <FormGroup>
              <Label htmlFor="realName">{t('realName', '真實姓名')} <span style={{color: '#cf0404'}}>*</span></Label>
              <Input type="text" id="realName" name="realName" placeholder={t('realName', '請輸入真實姓名')} value={formData.realName} onChange={handleInputChange} required />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="email">{t('email', 'Email')} <span style={{color: '#cf0404'}}>*</span></Label>
              <Input type="email" id="email" name="email" placeholder={t('email', '請輸入Email')} value={formData.email} onChange={handleInputChange} required />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="phone">{t('phone', '聯絡電話')} <span style={{color: '#cf0404'}}>*</span></Label>
              <Input type="text" id="phone" name="phone" placeholder={t('phone', '請輸入聯絡電話')} value={formData.phone} onChange={handleInputChange} required />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="idNumber">{t('idNumber', '身分證字號 / 護照號碼')} <span style={{color: '#cf0404'}}>*</span></Label>
              <Input type="text" id="idNumber" name="idNumber" placeholder={t('idNumber', '請輸入身分證字號或護照號碼')} value={formData.idNumber} onChange={handleInputChange} required />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="facebook">{t('facebook', '社群連結：Facebook')}</Label>
              <Input type="text" id="facebook" name="facebook" placeholder={t('facebook', 'Facebook連結')} value={formData.facebook} onChange={handleInputChange} />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="instagram">{t('instagram', '社群連結：Instagram')}</Label>
              <Input type="text" id="instagram" name="instagram" placeholder={t('instagram', 'Instagram連結')} value={formData.instagram} onChange={handleInputChange} />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="twitter">{t('twitter', '社群連結：X（Twitter）')}</Label>
              <Input type="text" id="twitter" name="twitter" placeholder={t('twitter', 'X（Twitter）連結')} value={formData.twitter} onChange={handleInputChange} />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="otherSocial">{t('otherSocial', '社群連結：其他')}</Label>
              <Input type="text" id="otherSocial" name="otherSocial" placeholder={t('otherSocial', '其他社群連結')} value={formData.otherSocial} onChange={handleInputChange} />
            </FormGroup>
            <SectionLabel>{t('sectionEntry', '報名資料')}</SectionLabel>

              {/* 新項目: 参加日チェックボックス */}
              <FormGroup>
                <Label>{t('entryDays', '報名日期')} <span style={{color: '#cf0404'}}>*</span></Label>
                <div style={{ display: 'flex', gap: '2rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="checkbox"
                      name="entryDays"
                      value="3/28"
                      checked={formData.entryDays.includes('3/28')}
                      onChange={handleInputChange}
                    /> 3/28
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="checkbox"
                      name="entryDays"
                      value="3/29"
                      checked={formData.entryDays.includes('3/29')}
                      onChange={handleInputChange}
                    /> 3/29
                  </label>
                </div>
              </FormGroup>
            {/* 攤位類型を先に移動 */}
            <FormGroup>
              <Label>{t('boothType', '攤位類型')}</Label>
              <RadioGroup>
                <RadioLabel>
                  <RadioInput type="radio" name="boothType" value="standard" checked={formData.boothType === 'standard'} onChange={handleBoothTypeChange} /> {t('boothTypeStandard', '標準攤位')}
                </RadioLabel>
                <RadioLabel>
                  <RadioInput type="radio" name="boothType" value="double" checked={formData.boothType === 'double'} onChange={handleBoothTypeChange} /> {t('boothTypeDouble', '雙人攤位')}
                </RadioLabel>
              </RadioGroup>
            </FormGroup>
            {/* 創作者姓名フィールド */}
            <FormGroup>
              <Label>{t('creatorName', '創作者姓名')}{formData.boothType === 'double' ? '1' : ''} <span style={{color: '#cf0404'}}>*</span></Label>
              <Input type="text" name="creatorName1" placeholder={t('creatorName', '創作者姓名')} value={formData.creatorName1} onChange={handleInputChange} required />
            </FormGroup>
            {formData.boothType === 'double' && (
              <FormGroup>
                <Label>{t('creatorName2', '創作者姓名2')} <span style={{color: '#cf0404'}}>*</span></Label>
                <Input type="text" name="creatorName2" placeholder={t('creatorName', '創作者姓名')} value={formData.creatorName2} onChange={handleInputChange} required />
              </FormGroup>
            )}
            
            <FormGroup>
              <Label htmlFor="boothName">{t('boothName', '攤位名稱')} <span style={{color: '#cf0404'}}>*</span></Label>
              <Input type="text" id="boothName" name="boothName" placeholder={t('boothName', '攤位名稱')} value={formData.boothName} onChange={handleInputChange} required />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="boothSubtitle">{t('boothSubtitle', '攤位副標')}</Label>
              <Input type="text" id="boothSubtitle" name="boothSubtitle" placeholder={t('boothSubtitle', '攤位副標')} value={formData.boothSubtitle} onChange={handleInputChange} />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="lanternName">{t('lanternName', '燈籠名稱（限六個字以内）')} <span style={{color: '#cf0404'}}>*</span></Label>
              <Input type="text" id="lanternName" name="lanternName" placeholder={t('lanternName', '燈籠名稱（限六個字）')} maxLength={6} value={formData.lanternName} onChange={handleInputChange} required />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="lanternSubtitle">{t('lanternSubtitle', '燈籠副標')}</Label>
              <Input type="text" id="lanternSubtitle" name="lanternSubtitle" placeholder={t('lanternSubtitle', '燈籠副標')} value={formData.lanternSubtitle} onChange={handleInputChange} />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="promo1">{t('promo1', '宣傳素材1（尺寸規格：至少為1080 x 1920）')} <span style={{color: '#cf0404'}}>*</span></Label>
              <Input type="file" id="promo1" name="promo1" accept="image/*" onChange={handleInputChange} required ref={promo1Ref} />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="promo2">{t('promo2', '宣傳素材2（尺寸規格：至少為1080 x 1920）')} <span style={{color: '#cf0404'}}>*</span></Label>
              <Input type="file" id="promo2" name="promo2" accept="image/*" onChange={handleInputChange} required ref={promo2Ref} />
            </FormGroup>
            {/* 新項目: 推薦人（短文） */}
            <FormGroup>
              <Label htmlFor="recommender">{t('recommender', '推薦人')}</Label>
              <Input type="text" id="recommender" name="recommender" placeholder={t('recommender', '推薦人')} value={formData.recommender} onChange={handleInputChange} />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="hardware">{t('hardware', '額外硬體需求（請填寫品項及數量）')}</Label>
              <Input type="text" id="hardware" name="hardware" placeholder={t('hardwarePlaceholder', '例：插座2個、桌子1張')} value={formData.hardware} onChange={handleInputChange} />
            </FormGroup>
            {/* 備註欄 */}
            <FormGroup>
              <Label htmlFor="remarks">{t('remarks', '備註：')}<br/>{t('remarksDesc', '（若有任何特別需求請告知我們，或寄信給官方信箱，我們會儘速回覆您）')}</Label>
              <RemarksTextarea id="remarks" name="remarks" rows={3} placeholder={t('remarksPlaceholder', '備註、特別需求')} value={formData.remarks} onChange={handleInputChange} />
            </FormGroup>
            <SubmitButton type="submit" disabled={status.submitting || !isFormValid()}>{status.submitting ? t('submitSending', '送信中...') : t('submitConfirm', '確認報名')}</SubmitButton>
            {status.info.msg && (
              <div style={{ marginTop: '1rem', textAlign: 'center', color: status.info.error ? '#c00' : '#155724', background: status.info.error ? '#f8d7da' : '#d4edda', padding: '0.75rem', borderRadius: 4 }}>
                {status.info.msg}
              </div>
            )}
          </StyledForm>
        </FormSection>
      </Page>
  );
};

// 報名簡章用の下線付きリンク
const UnderlinedLink = styled.a`
  text-decoration: underline;
  font-size: 1.4rem;
  font-weight: 600;
  &:hover {
    color: #ea6d9a;
  }
`;
const LinkBlock = styled.div`
    margin-bottom: 10px;
`;
const SectionImages = styled.section`
  background: #fff;
  padding: 0;
  width: 100%;
  margin-left: 0;
  margin-bottom: 16px;
  position: relative;
  text-align: center;
`;

const DescriptionBox = styled.div`
  max-width: 600px;
  margin: 12px 0 0 16px;
  padding: 16px 12px 16px 20px;
  text-align: left;
  @media (max-width: 768px) {
    padding-left: 0;
  }
`;

const DescriptionTitle = styled.h2`
  font-size: 1.6rem;
  font-weight: bold;
  margin-bottom: 12px;
  color: #222;
`;

const DescriptionText = styled.p`
  font-size: 1.1rem;
  color: #444;
  margin: 0;
  padding-left: 2.1em;
  margin-bottom: 24px;
`;


// --- Form Styles ---
const FormSection = styled.section`
  background: #fff;
  margin: 48px auto 32px;
  padding: 32px 24px;
  max-width: 700px;
  border-radius: 8px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
`;

const FormTitle = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 24px;
  color: #222;
  text-align: center;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SectionLabel = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin: 32px 0 16px 0;
  color: #444;
`;

const FormGroup = styled.div`
  margin-bottom: 1.2rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 0.5rem;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 400;
`;

const RadioInput = styled.input`
  accent-color: #222;
`;

const RemarksTextarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  resize: vertical;
`;

const SubmitButton = styled.button<{disabled?: boolean}>`
  background-color: ${({ disabled }) => disabled ? '#888' : '#cf0404'};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  opacity: ${({ disabled }) => disabled ? 0.7 : 1};
  align-self: center;
  transition: background 0.2s, opacity 0.2s;
`;

export default HomePage;

