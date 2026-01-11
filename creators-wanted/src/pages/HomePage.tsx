import React from 'react';
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
  width: 100vw;
  margin-left: calc(50% - 50vw);
`;

const HeroCard = styled.div`
  position: relative;
  border-radius: 0;
  overflow: hidden;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.12);
  width: 100vw;
`;


const HeroImg = styled.img`
  display: block;
  width: 100vw;
  max-width: 100vw;
  height: auto;
`;
const SetumeiImg = styled.img`
  display: block;
  width: 90vw;
  max-width: 90vw;
  height: auto;
  margin: 0 auto;
`;

const HomePage: React.FC = () => {
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

  // 攤位類型の状態
  const [boothType, setBoothType] = React.useState('standard');

  // 創作者姓名の状態（最大2名）
  const [creatorNames, setCreatorNames] = React.useState(['', '']);

  // boothType変更時のハンドラ
  const handleBoothTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBoothType(e.target.value);
    // boothTypeがstandardなら1名、doubleなら2名分
    setCreatorNames(e.target.value === 'double' ? ['', ''] : ['']);
  };

  // 創作者姓名入力のハンドラ
  const handleCreatorNameChange = (idx: number, value: string) => {
    setCreatorNames(prev => {
      const updated = [...prev];
      updated[idx] = value;
      return updated;
    });
  };

  return (
    <Page>
      <Helmet>
        <title>Creators Wanted｜Adultopia 大人國</title>
        <meta
          name="description"
          content="2026 Adultopia 大人國｜創作者募集（出展者報名）"
        />
        <meta property="og:title" content="Creators Wanted｜Adultopia 大人國" />
        <meta property="og:description" content="2026 Adultopia 大人國｜創作者募集（出展者報名）" />
        <meta property="og:image" content="/adultopia/og.jpg" />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* HERO */}
      <HeroWrap>
        <HeroCard>
          <HeroImg
            src={heroSrc}
            alt="ADULTOPIA 大人國 2026 Creators Wanted"
          />
        </HeroCard>
      </HeroWrap>
      <DescriptionBox>
        <DescriptionTitle>
          <DescriptionTitleWithImage imgSrc={process.env.PUBLIC_URL + '/adultopia/logoHeart.png'} imgAlt="ロゴ">
            活動資訊
          </DescriptionTitleWithImage>
        </DescriptionTitle>
        <DescriptionText>
          活動名稱：2026 Adultopia 大人國<br/>
          活動日期：2026/03/28-2026/03/29<br/>
          　創作者入場時間：09:00-18:00<br/>
          　快通票入場時間：09:30-18:00<br/>
          　一般票入場時間：10:00-18:00<br/>
          活動地點：桃園會展中心<br/>
          活動地址：桃園市中壢區領航北路一段99號
        </DescriptionText>
        <DescriptionTitle>
          <DescriptionTitleWithImage imgSrc={process.env.PUBLIC_URL + '/adultopia/logoHeart.png'} imgAlt="ロゴ">
            攤位報名資訊
          </DescriptionTitleWithImage>
        </DescriptionTitle>
        <DescriptionText>
          攤位招募時間：2026/01/10 開放線上報名<br/>
          招募截止時間：2026/01/31 截止報名<br/>
          攤位數量：<br/>
          　單人攤位每日____攤<br/>
          　雙人攤位每日____攤<br/>
          招募類型：Cosplay、寫真、KOL、動漫周邊、同人誌
        </DescriptionText>
        <DescriptionTitle>
          <DescriptionTitleWithImage imgSrc={process.env.PUBLIC_URL + '/adultopia/logoHeart.png'} imgAlt="ロゴ">
            攤位資訊
          </DescriptionTitleWithImage>
        </DescriptionTitle>
      </DescriptionBox>

      {/* 説明画像1 */}
      <SectionImages>
        <SetumeiImg
          src={`${process.env.PUBLIC_URL}/adultopia/setumei1.jpg`}
          alt="説明画像1"
        />
      </SectionImages>
      
      {/* 説明画像2 */}
      <SectionImages>
        <SetumeiImg
          src={`${process.env.PUBLIC_URL}/adultopia/setumei2.jpg`}
          alt="説明画像2"
        />
        
      </SectionImages>
      {/* 説明画像3 */}
      <SectionImages>
        <SetumeiImg
          src={`${process.env.PUBLIC_URL}/adultopia/setumei3.jpg`}
          alt="説明画像3"
        />
      </SectionImages>
      {/* 説明画像4 */}
      <SectionImages>
        <SetumeiImg
          src={`${process.env.PUBLIC_URL}/adultopia/setumei4.jpg`}
          alt="説明画像4"
        />
      </SectionImages>
      {/* 説明画像5 */}
      <SectionImages>
        <SetumeiImg
          src={`${process.env.PUBLIC_URL}/adultopia/setumei5.jpg`}
          alt="説明画像5"
        />
      </SectionImages>
      <DescriptionBox>
        <DescriptionTitle>
          <DescriptionTitleWithImage imgSrc={process.env.PUBLIC_URL + '/adultopia/logoHeart.png'} imgAlt="ロゴ">
            報名流程
          </DescriptionTitleWithImage>
        </DescriptionTitle>
      </DescriptionBox>
      {/* プロセス画像 */}
      <SectionImages>
        <SetumeiImg
          src={`${process.env.PUBLIC_URL}/adultopia/process2.jpg`}
          alt="プロセス画像"
        />
      </SectionImages>
      <DescriptionBox>
        <DescriptionTitle>
          <DescriptionTitleWithImage imgSrc={process.env.PUBLIC_URL + '/adultopia/logoHeart.png'} imgAlt="ロゴ">
            報名簡章
          </DescriptionTitleWithImage>
        </DescriptionTitle>
            <DescriptionText>
              <LinkBlock>
                <UnderlinedLink href="https://drive.google.com/file/d/1cmho-0zuCSzWY2ZwOwfWZug2oVlnkmFv/view?usp=drive_link" target="_blank" rel="noopener noreferrer">中文報名簡章</UnderlinedLink>
              </LinkBlock>
              <LinkBlock>
                <UnderlinedLink href="https://drive.google.com/file/d/11JKyad1tMkJS91U8jN6ylWTy5vC8y-wV/view?usp=drive_link" target="_blank" rel="noopener noreferrer">日文報名簡章</UnderlinedLink>
              </LinkBlock>
              <LinkBlock>
                <UnderlinedLink href="https://drive.google.com/file/d/1zaYTqjBmS7A4a3SEUju2woYeKUlt1d9b/view?usp=sharing" target="_blank" rel="noopener noreferrer">韓文報名簡章</UnderlinedLink>
              </LinkBlock>
            </DescriptionText>
      </DescriptionBox>
      <DescriptionBox>
        <DescriptionTitle>
          <DescriptionTitleWithImage imgSrc={process.env.PUBLIC_URL + '/adultopia/logoHeart.png'} imgAlt="ロゴ">
            攤位報名資料填寫
          </DescriptionTitleWithImage>
        </DescriptionTitle>
      </DescriptionBox>
        {/* 報名フォーム（見た目のみ） */}
        <FormSection>
          <FormTitle>報名表單</FormTitle>
          <StyledForm>
            <SectionLabel>基本資料</SectionLabel>
            <FormGroup>
              <Label htmlFor="realName">真實姓名</Label>
              <Input type="text" id="realName" name="realName" placeholder="請輸入真實姓名" />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="email">Email</Label>
              <Input type="email" id="email" name="email" placeholder="請輸入Email" />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="phone">聯絡電話</Label>
              <Input type="text" id="phone" name="phone" placeholder="請輸入聯絡電話" />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="idNumber">身分證字號 / 護照號碼</Label>
              <Input type="text" id="idNumber" name="idNumber" placeholder="請輸入身分證字號或護照號碼" />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="facebook">社群連結：Facebook</Label>
              <Input type="text" id="facebook" name="facebook" placeholder="Facebook連結" />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="instagram">社群連結：Instagram</Label>
              <Input type="text" id="instagram" name="instagram" placeholder="Instagram連結" />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="twitter">社群連結：X（Twitter）</Label>
              <Input type="text" id="twitter" name="twitter" placeholder="X（Twitter）連結" />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="otherSocial">社群連結：其他</Label>
              <Input type="text" id="otherSocial" name="otherSocial" placeholder="其他社群連結" />
            </FormGroup>
            <SectionLabel>報名資料</SectionLabel>
            {/* 攤位類型を先に移動 */}
            <FormGroup>
              <Label>攤位類型</Label>
              <RadioGroup>
                <RadioLabel>
                  <RadioInput type="radio" name="boothType" value="standard" checked={boothType === 'standard'} onChange={handleBoothTypeChange} /> 標準攤位
                </RadioLabel>
                <RadioLabel>
                  <RadioInput type="radio" name="boothType" value="double" checked={boothType === 'double'} onChange={handleBoothTypeChange} /> 雙人攤位
                </RadioLabel>
              </RadioGroup>
            </FormGroup>
            {/* 創作者姓名フィールド */}
            <FormGroup>
              <Label>創作者姓名{boothType === 'double' ? '1' : ''}</Label>
              <Input type="text" name="creatorName1" placeholder="創作者姓名1" value={creatorNames[0] || ''} onChange={e => handleCreatorNameChange(0, e.target.value)} />
            </FormGroup>
            {boothType === 'double' && (
              <FormGroup>
                <Label>創作者姓名2</Label>
                <Input type="text" name="creatorName2" placeholder="創作者姓名2" value={creatorNames[1] || ''} onChange={e => handleCreatorNameChange(1, e.target.value)} />
              </FormGroup>
            )}
            
            <FormGroup>
              <Label htmlFor="boothName">攤位名稱</Label>
              <Input type="text" id="boothName" name="boothName" placeholder="攤位名稱" />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="boothSubtitle">攤位副標（可不填）</Label>
              <Input type="text" id="boothSubtitle" name="boothSubtitle" placeholder="攤位副標" />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="lanternName">燈籠名稱（限六個字）</Label>
              <Input type="text" id="lanternName" name="lanternName" placeholder="燈籠名稱（限六個字）" maxLength={6} />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="lanternSubtitle">燈籠副標（可不填）</Label>
              <Input type="text" id="lanternSubtitle" name="lanternSubtitle" placeholder="燈籠副標" />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="promo1">宣傳素材1（尺寸規格：至少為1080 x 1920）</Label>
              <Input type="file" id="promo1" name="promo1" accept="image/*" />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="promo2">宣傳素材2（尺寸規格：至少為1080 x 1920）</Label>
              <Input type="file" id="promo2" name="promo2" accept="image/*" />
            </FormGroup>
            {/* ...existing code... */}
            <FormGroup>
              <Label htmlFor="hardware">額外硬體需求（請填寫品項及數量）</Label>
              <Input type="text" id="hardware" name="hardware" placeholder="例：插座2個、桌子1張" />
            </FormGroup>
            {/* 備註欄 */}
            <FormGroup>
              <Label htmlFor="remarks">備註：<br/>（若有任何特別需求請告知我們，或寄信給官方信箱，我們會儘速回覆您）</Label>
              <RemarksTextarea id="remarks" name="remarks" rows={3} placeholder="備註、特別需求" />
            </FormGroup>
            <SubmitButton type="button" disabled>確認報名</SubmitButton>
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
  width: 100vw;
  margin-left: calc(50% - 50vw);
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

const SubmitButton = styled.button`
  background-color: #222;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  cursor: not-allowed;
  opacity: 0.7;
  align-self: center;
`;

export default HomePage;

