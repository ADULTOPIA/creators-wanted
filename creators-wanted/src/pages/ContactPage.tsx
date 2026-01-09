import React, { useState, FormEvent, ChangeEvent } from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';

const PageContainer = styled.div`
  padding: 8rem 2rem 4rem;
  max-width: 800px;
  margin: 0 auto;
  background-color: ${({ theme }) => theme.colors.white};
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;
`;

const Content = styled.div`
  font-size: 1.1rem;
  
  p {
    text-align: center;
    margin-bottom: 2rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  max-width: 600px;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.gray};
  border-radius: 4px;
  font-size: 1rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.gray};
  border-radius: 4px;
  font-size: 1rem;
  min-height: 150px;
  resize: vertical;
`;

const SubmitButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  align-self: center;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark || '#0056b3'};
  }
  
  &:disabled {
    background-color: ${({ theme }) => theme.colors.gray};
    cursor: not-allowed;
  }
`;

const StatusMessage = styled.div<{ isError?: boolean }>`
  margin-top: 1rem;
  padding: 0.75rem;
  border-radius: 4px;
  text-align: center;
  background-color: ${({ isError, theme }) => 
    isError ? '#f8d7da' : '#d4edda'};
  color: ${({ isError }) => 
    isError ? '#721c24' : '#155724'};
  display: flex;
  justify-content: center;
`;

const ContactPage: React.FC = () => {
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  const [status, setStatus] = useState({
    submitted: false,
    submitting: false,
    info: { error: false, msg: null as string | null }
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({
      submitted: false,
      submitting: true,
      info: { error: false, msg: null }
    });

    try {
      // Google Formsの送信URL (提供されたURLから整形)
      const googleFormURL = 'https://docs.google.com/forms/d/e/1FAIpQLSfY0rKxr_XDxfZ6ZBQpgoytA_vYaTz6a2OmPH87SkCwStjs7w/formResponse';
      
      // フォームデータの作成
      const formEntryData = new FormData();
      
      // Google Formsのフィールド名を指定
      // 注意: 実際のフォームのエントリーIDに置き換える必要があります
      formEntryData.append('entry.2005620554', formData.name); // お名前フィールド
      formEntryData.append('entry.1045781291', formData.email); // メールアドレスフィールド
      formEntryData.append('entry.839337160', formData.message); // メッセージフィールド

      // デバッグ用: FormDataの中身を出力
      formEntryData.forEach((value, key) => {
        console.log(key + ': ' + value);
      });
      console.log('formData:', formData);
      
      // fetch APIを使用してフォームを送信
      // CORSエラーを回避するためにno-corsモードを使用
      const response = await fetch(googleFormURL, {
        method: 'POST',
        mode: 'no-cors', // Google Formsの制限のため必要
        body: formEntryData
      });
      
      // no-corsモードではレスポンスを確認できないため、成功したとみなす
      setStatus({
        submitted: true,
        submitting: false,
        info: { error: false, msg: '送信が完了しました。ありがとうございました。' }
      });
      
      // フォームのリセット
      setFormData({
        name: '',
        email: '',
        message: ''
      });
      
    } catch (error) {
      setStatus({
        submitted: false,
        submitting: false,
        info: { error: true, msg: '送信中にエラーが発生しました。時間をおいて再度お試しください。' }
      });
    }
  };

  return (
    <PageContainer>
      <Helmet>
        <title>お問い合わせ｜Creators Wanted</title>
        <meta name="description" content="Creators Wantedへのお問い合わせページです。" />
      </Helmet>
      
      <PageTitle>お問い合わせ</PageTitle>
      <Content>
        <p>ご質問・ご要望などございましたら、下記フォームよりご連絡ください。</p>
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="name">お名前</Label>
            <Input 
              type="text" 
              id="name" 
              name="name" 
              value={formData.name}
              onChange={handleChange}
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="email">メールアドレス</Label>
            <Input 
              type="email" 
              id="email" 
              name="email" 
              value={formData.email}
              onChange={handleChange}
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="message">お問い合わせ内容</Label>
            <TextArea 
              id="message" 
              name="message" 
              value={formData.message}
              onChange={handleChange}
              required
            />
          </FormGroup>
          
          <SubmitButton type="submit" disabled={status.submitting}>
            {status.submitting ? '送信中...' : '送信'}
          </SubmitButton>
          
          {status.info.msg && (
            <StatusMessage isError={status.info.error}>
              {status.info.msg}
            </StatusMessage>
          )}
        </Form>
      </Content>
    </PageContainer>
  );
};

export default ContactPage;
